import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fileViewerRenderers } from '@file-viewer/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import Pages from 'vite-plugin-pages';

const h5Root = fileURLToPath(new URL('.', import.meta.url));
const sourceRoot = fileURLToPath(new URL('./src', import.meta.url));
const featureRoot = fileURLToPath(new URL('./features', import.meta.url));
const projectRoot = fileURLToPath(new URL('./src/projects', import.meta.url));
const selectionFile = fileURLToPath(new URL('./.h5/selected-project.json', import.meta.url));
const defaultApiTarget = 'http://127.0.0.1/';
const projectIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

interface SelectedProjectMetadata {
  schemaVersion: number;
  projectId: string;
  projectModule: string;
  featureIds: string[];
  routeIds: string[];
}

function resolveApiTarget(rawTarget: string | undefined): string {
  const target = rawTarget?.trim() || defaultApiTarget;

  let url: URL;
  try {
    url = new URL(target);
  } catch {
    throw new Error(`VITE_APP_BASE_URL "${target}" 不是有效 URL`);
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`VITE_APP_BASE_URL 只允许 http/https，当前为 "${url.protocol}"`);
  }

  return url.toString();
}

function resolveProject(rawProjectId: string | undefined): {
  id: string;
  file: string;
  selection: SelectedProjectMetadata;
} {
  const projectId = rawProjectId?.trim() || 'default';
  if (!projectIdPattern.test(projectId)) {
    throw new Error(`VITE_APP_PROJECT "${projectId}" 只允许小写字母、数字和连字符`);
  }

  const projectFile = path.join(projectRoot, `${projectId}.ts`);
  if (!existsSync(projectFile)) {
    throw new Error(`VITE_APP_PROJECT "${projectId}" 不存在，对应文件应为 ${projectFile}`);
  }
  if (!existsSync(selectionFile)) {
    throw new Error('缺少项目选择记录，请先执行 pnpm select:project');
  }

  const selection = JSON.parse(readFileSync(selectionFile, 'utf8')) as SelectedProjectMetadata;
  if (selection.schemaVersion !== 1 || selection.projectId !== projectId) {
    throw new Error(`项目选择记录与 VITE_APP_PROJECT "${projectId}" 不一致，请重新执行 pnpm select:project`);
  }

  return { id: projectId, file: projectFile, selection };
}

function normalizeModuleId(moduleId: string): string {
  return moduleId.replaceAll(path.sep, '/').split('?')[0];
}

function createClientModuleGraphPlugin(selection: SelectedProjectMetadata): Plugin {
  return {
    name: 'fa-h5-client-module-graph',
    apply: 'build',
    generateBundle(_outputOptions, bundle) {
      const moduleIds = new Set<string>();
      for (const output of Object.values(bundle)) {
        if (output.type === 'chunk') {
          for (const moduleId of Object.keys(output.modules)) {
            moduleIds.add(normalizeModuleId(moduleId));
          }
        }
      }

      const featurePattern = /\/features\/(fa-[a-z0-9-]+-pages)(?:\/|$)/;
      const bundledFeatureIds = [
        ...new Set([...moduleIds].map((moduleId) => moduleId.match(featurePattern)?.[1]).filter((featureId): featureId is string => Boolean(featureId))),
      ].sort();
      const disabledFeatureIds = bundledFeatureIds.filter((featureId) => !selection.featureIds.includes(featureId));
      const forbiddenModules = [...moduleIds].filter(
        (moduleId) =>
          moduleId.includes('/frontend/apps/admin/') ||
          moduleId.includes('/node_modules/antd/') ||
          moduleId.includes('/node_modules/@ant-design/icons/') ||
          moduleId.includes('/fa-ui/packages/ui/'),
      );

      if (disabledFeatureIds.length > 0) {
        throw new Error(`[H5 Module Graph] 未启用 Feature 进入客户端产物：${disabledFeatureIds.join(', ')}`);
      }
      if (forbiddenModules.length > 0) {
        throw new Error(`[H5 Module Graph] 客户端产物包含禁止依赖：${forbiddenModules.join(', ')}`);
      }

      const applicationModules = [...moduleIds]
        .filter((moduleId) => moduleId.startsWith(normalizeModuleId(h5Root)))
        .filter((moduleId) => !moduleId.includes('/node_modules/'))
        .map((moduleId) => path.relative(h5Root, moduleId).split(path.sep).join('/'))
        .sort();
      const graph = {
        schemaVersion: 1,
        projectId: selection.projectId,
        enabledFeatureIds: [...selection.featureIds].sort(),
        bundledFeatureIds,
        routeIds: selection.routeIds,
        forbiddenModules: [],
        applicationModules,
      };

      this.emitFile({
        type: 'asset',
        fileName: 'client-module-graph.json',
        source: `${JSON.stringify(graph, null, 2)}\n`,
      });
    },
  };
}

function flattenPageRoutes(routes: any[], parentPath = ''): any[] {
  return routes.flatMap((route) => {
    const path = route.path === '/' ? (parentPath || '/') : `${parentPath}/${route.path || ''}`.replace(/\/+/g, '/');
    const current = route.element ? [{ ...route, path, children: undefined }] : [];
    return [...current, ...flattenPageRoutes(route.children || [], path === '/' ? '' : path)];
  });
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, h5Root, '');
  const apiTarget = resolveApiTarget(env.VITE_APP_BASE_URL);
  const selectedProject = resolveProject(env.VITE_APP_PROJECT);

  return {
    // 开发和生产使用相同路径语义，避免 basename 与静态资源前缀漂移。
    base: '/h5/',
    plugins: [
      fileViewerRenderers({ preset: 'office', copyAssets: true }),
      react(),
      Pages({
        dirs: [{ dir: '.h5/pages', baseRoute: '' }],
        resolver: 'react',
        onRoutesGenerated: (routes) => flattenPageRoutes(routes),
      }),
      createClientModuleGraphPlugin(selectedProject.selection),
    ],
    resolve: {
      alias: {
        '@': sourceRoot,
        '@features': featureRoot,
        '@project': selectedProject.file,
      },
    },
    build: {
      target: ['chrome111', 'edge111', 'firefox114', 'safari16.4', 'ios16.4'],
    },
    server: {
      port: 9002,
      strictPort: true,
      // File Viewer 的 Office 运行时资源由插件复制到 public/vendor，属于
      // 不参与 HMR 的静态资源。Windows 下监听其中的 OTF/WASM 文件可能触发
      // EBUSY，因此将这类运行时资源排除在 Vite 文件监听之外。
      watch: {
        ignored: ['**/public/vendor/**'],
      },
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});

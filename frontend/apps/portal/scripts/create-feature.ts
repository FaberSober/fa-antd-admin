import { resolve } from 'node:path';
import {
  commaSeparated,
  featureIdPattern,
  featureRoot,
  isDirectExecution,
  parseArguments,
  requiredArgument,
  routeSegmentPattern,
  toCamelCase,
  toPascalCase,
  toTsString,
  writeDirectoryAtomically,
} from './engineering-utils';

export interface CreateFeatureOptions {
  id: string;
  route: string;
  label: string;
  description?: string;
  dependsOn?: readonly string[];
  navigation?: boolean;
  prerender?: boolean;
  outputDirectory?: string;
  dryRun?: boolean;
}

export interface FeatureScaffoldResult {
  targetDirectory: string;
  files: Readonly<Record<string, string>>;
}

function renderFeature(options: Required<Pick<CreateFeatureOptions, 'id' | 'route' | 'label' | 'navigation' | 'prerender'>> & CreateFeatureOptions): string {
  const featureName = toCamelCase(options.id);
  const dependencies = options.dependsOn?.length
    ? `\n  dependsOn: [${options.dependsOn.map(toTsString).join(', ')}],`
    : '';
  const navigation = options.navigation
    ? `\n  navigation: [\n    {\n      key: ${toTsString(`${options.id}.index`)},\n      label: ${toTsString(options.label)},\n      to: ${toTsString(`/${options.route}`)},\n      order: 100,\n    },\n  ],`
    : '';
  const prerender = options.prerender ? `\n  prerenderPaths: [${toTsString(`/${options.route}`)}],` : '';

  return `import { definePortalFeature } from '../../kernel/feature';
import { ${featureName}Routes } from './routes';

export default definePortalFeature({
  id: ${toTsString(options.id)},${dependencies}
  routes: ${featureName}Routes,${navigation}${prerender}
});
`;
}

function renderRoutes(options: CreateFeatureOptions): string {
  const featureName = toCamelCase(options.id);
  return `import type { PortalRouteDefinition } from '../../kernel/feature';

export const ${featureName}Routes = [
  {
    id: ${toTsString(`${options.id}.index`)},
    path: ${toTsString(options.route)},
    file: ${toTsString(`features/${options.id}/pages/${options.route}.tsx`)},
  },
] as const satisfies readonly PortalRouteDefinition[];
`;
}

function renderPage(options: CreateFeatureOptions): string {
  const componentName = `${toPascalCase(options.id)}Page`;
  const description = options.description || `${options.label}页面。`;
  return `import type { MetaFunction } from 'react-router-dom';
import { createPortalMeta } from '../../../kernel/seo';
import pageStyles from '../../../shared/styles/page.module.css';
import { Breadcrumbs } from '../../../shared/ui/Breadcrumbs';
import styles from './${options.route}.module.css';

export const meta: MetaFunction = () =>
  createPortalMeta({
    title: ${toTsString(`${options.label}｜FA Portal`)},
    description: ${toTsString(description)},
    path: ${toTsString(`/${options.route}`)},
  });

export default function ${componentName}() {
  return (
    <>
      <header className={pageStyles.pageHeader}>
        <div className={pageStyles.pageHeaderInner}>
          <Breadcrumbs items={[{ label: ${toTsString(options.label)} }]} />
          <p className={pageStyles.eyebrow}>PORTAL FEATURE</p>
          <h1>{${toTsString(options.label)}}</h1>
          <p className={pageStyles.lead}>{${toTsString(description)}}</p>
        </div>
      </header>
      <section className={pageStyles.section}>
        <div className={styles.content}>
          <h2>{${toTsString(`开始构建 ${options.label}`)}}</h2>
          <p>请在当前 Feature 内完成页面、服务、内容和资源实现，并补充 README 中的公开契约。</p>
        </div>
      </section>
    </>
  );
}
`;
}

function renderReadme(options: CreateFeatureOptions): string {
  const dependencies = options.dependsOn?.length ? options.dependsOn.join('、') : '无';
  return `# ${options.id}

${options.description || `${options.label}页面。`}

## 启用

在目标 Profile 中静态导入：

\`\`\`ts
import ${toCamelCase(options.id)}Feature from '../features/${options.id}/feature';
\`\`\`

## 公开契约

- Feature ID：\`${options.id}\`
- 依赖 Feature：${dependencies}
- 路由：\`/${options.route}\`
- 导航：${options.navigation ? options.label : '无'}
- 预渲染：${options.prerender ? `/${options.route}` : '无'}

## 依赖边界

- 只依赖自身、\`app/kernel\`、\`app/shared\` 和已声明 Feature 的公开入口。
- 禁止导入 Admin、Ant Design、\`@fa/ui\` 或其他 Feature 的内部文件。

## 配置与接口

当前无。新增配置和接口时记录公开变量、认证要求、超时与错误处理。

## 性能与验证

- 页面保持路由级拆包。
- 执行 \`pnpm --filter @fa/portal check:engineering\`。
- 在至少一个目标 Profile 中验证深链接、移动端和生产构建。

## 生命周期

当前状态：active。废弃时按 \`docs/feature-lifecycle.md\` 增加生命周期和 Profile 迁移确认。
`;
}

export function createFeatureScaffold(options: CreateFeatureOptions): FeatureScaffoldResult {
  if (!featureIdPattern.test(options.id)) throw new Error(`Feature ID "${options.id}" 必须使用 fa-<backend>-pages`);
  if (!routeSegmentPattern.test(options.route)) throw new Error(`初始路由 "${options.route}" 必须是单段 kebab-case`);
  if (!options.label.trim()) throw new Error('Feature label 不能为空');

  const dependsOn = [...new Set(options.dependsOn || [])];
  for (const dependency of dependsOn) {
    if (!featureIdPattern.test(dependency)) throw new Error(`依赖 Feature ID "${dependency}" 无效`);
    if (dependency === options.id) throw new Error('Feature 不能依赖自身');
  }

  const normalizedOptions = {
    ...options,
    label: options.label.trim(),
    description: options.description?.trim(),
    dependsOn,
    navigation: options.navigation ?? true,
    prerender: options.prerender ?? true,
  };
  const files = {
    'feature.ts': renderFeature(normalizedOptions),
    'routes.ts': renderRoutes(normalizedOptions),
    [`pages/${options.route}.tsx`]: renderPage(normalizedOptions),
    [`pages/${options.route}.module.css`]: `.content {\n  display: grid;\n  gap: 1rem;\n}\n`,
    'README.md': renderReadme(normalizedOptions),
  };
  const targetDirectory = resolve(options.outputDirectory || featureRoot, options.id);
  if (!options.dryRun) writeDirectoryAtomically(targetDirectory, files);
  return { targetDirectory, files };
}

async function main(): Promise<void> {
  const arguments_ = parseArguments(
    process.argv.slice(2),
    ['id', 'route', 'label', 'description', 'depends-on', 'output'],
    ['no-navigation', 'no-prerender', 'dry-run'],
  );
  const result = createFeatureScaffold({
    id: requiredArgument(arguments_, 'id'),
    route: requiredArgument(arguments_, 'route'),
    label: requiredArgument(arguments_, 'label'),
    description: arguments_.values.get('description'),
    dependsOn: commaSeparated(arguments_.values.get('depends-on')),
    navigation: !arguments_.flags.has('no-navigation'),
    prerender: !arguments_.flags.has('no-prerender'),
    outputDirectory: arguments_.values.get('output'),
    dryRun: arguments_.flags.has('dry-run'),
  });

  console.log(`${arguments_.flags.has('dry-run') ? 'Feature scaffold preview' : 'Feature created'}: ${result.targetDirectory}`);
  console.log('下一步：将 feature.ts 静态导入目标 Profile，并运行 check:engineering。');
}

if (isDirectExecution(import.meta.url)) await main();

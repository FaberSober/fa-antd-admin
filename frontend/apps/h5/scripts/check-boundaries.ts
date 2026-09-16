import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { discoverFeatureIds, featureRoot, h5Root, listSourceFiles, loadFeature, projectRoot, toH5Relative } from './engineering-utils';

interface ImportRecord {
  specifier: string;
}

const violations: string[] = [];
const bannedPackagePatterns = [/^antd(?:\/|$)/, /^@ant-design\/icons(?:\/|$)/, /^@fa\/ui(?:\/|$)/];

function report(file: string, message: string): void {
  violations.push(`${toH5Relative(file)}: ${message}`);
}

function extractImports(source: string): ImportRecord[] {
  const specifiers = new Set<string>();
  const patterns = [/(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g, /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      if (match[1]) {
        specifiers.add(match[1]);
      }
    }
  }
  return [...specifiers].map((specifier) => ({ specifier }));
}

function importedFeatureId(specifier: string): string | undefined {
  const match = specifier.match(/^@features\/(fa-[a-z0-9-]+-pages)(?:\/.*)?$/);
  return match?.[1];
}

async function checkFeature(featureId: string): Promise<void> {
  const directory = path.join(featureRoot, featureId);
  const feature = await loadFeature(featureId);
  if (feature.id !== featureId) {
    report(path.join(directory, 'index.ts'), `目录名必须与 feature.id "${feature.id}" 一致`);
  }
  const dependencies = new Set(feature.dependsOn ?? []);

  for (const file of await listSourceFiles(directory)) {
    const source = await readFile(file, 'utf8');
    if (source.includes('import.meta.glob')) {
      report(file, 'Feature 禁止使用 import.meta.glob 运行时全量扫描');
    }
    if (source.includes('VITE_APP_PROJECT') || source.includes('import.meta.env')) {
      report(file, 'Feature 禁止读取项目选择或环境变量');
    }
    if (/frontend\/apps\/admin|apps\/admin\/src|@admin\//.test(source)) {
      report(file, 'Feature 禁止依赖 Admin 源码');
    }

    for (const { specifier } of extractImports(source)) {
      if (bannedPackagePatterns.some((pattern) => pattern.test(specifier))) {
        report(file, `禁止依赖桌面端包 "${specifier}"`);
      }
      if (specifier === '@project' || specifier.startsWith('@/projects/')) {
        report(file, `Feature 禁止依赖 Project "${specifier}"`);
      }

      const targetFeatureId = importedFeatureId(specifier);
      if (targetFeatureId && targetFeatureId !== featureId) {
        if (specifier !== `@features/${targetFeatureId}`) {
          report(file, `跨 Feature 只能引用公共出口，当前为 "${specifier}"`);
        }
        if (!dependencies.has(targetFeatureId as never)) {
          report(file, `引用 Feature "${targetFeatureId}" 前必须在 dependsOn 声明`);
        }
      }

      if (specifier.startsWith('.')) {
        const target = path.resolve(path.dirname(file), specifier);
        if (target !== directory && !target.startsWith(`${directory}${path.sep}`)) {
          report(file, `相对导入越过 Feature 边界 "${specifier}"`);
        }
      }
    }
  }
}

async function checkProjects(): Promise<void> {
  for (const file of await listSourceFiles(projectRoot)) {
    const source = await readFile(file, 'utf8');
    if (source.includes('import.meta.glob')) {
      report(file, 'Project 禁止通过 import.meta.glob 扫描 Feature');
    }
    for (const { specifier } of extractImports(source)) {
      const targetFeatureId = importedFeatureId(specifier);
      if (targetFeatureId && specifier !== `@features/${targetFeatureId}`) {
        report(file, `Project 只能导入 Feature 公共出口，当前为 "${specifier}"`);
      }
      if (specifier.startsWith('./') || specifier.startsWith('../')) {
        report(file, `Project 禁止相互或深层相对导入 "${specifier}"`);
      }
    }
  }
}

async function checkProjectAliasUsage(): Promise<void> {
  const sourceRoot = path.join(h5Root, 'src');
  const allowedFile = path.join(sourceRoot, 'platform/feature/runtime.ts');
  for (const file of await listSourceFiles(sourceRoot)) {
    const source = await readFile(file, 'utf8');
    if (source.includes('import.meta.glob')) {
      report(file, 'H5 运行时代码禁止全量模块扫描');
    }
    if (file !== allowedFile) {
      for (const { specifier } of extractImports(source)) {
        if (specifier === '@project') {
          report(file, '@project 只能由 platform/feature/runtime.ts 消费');
        }
      }
    }
  }
}

for (const featureId of await discoverFeatureIds()) {
  await checkFeature(featureId);
}
await checkProjects();
await checkProjectAliasUsage();

if (violations.length > 0) {
  throw new Error(`[H5 Boundaries]\n${violations.map((item) => `- ${item}`).join('\n')}`);
}

console.log('[H5 Boundaries] Feature / Project / Runtime 边界检查通过');

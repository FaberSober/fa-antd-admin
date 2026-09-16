import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, relative, resolve } from 'node:path';
import type { PortalFeature, PortalRouteDefinition } from '../app/kernel/feature';
import {
  discoverFeatures,
  discoverProfiles,
  featureIdPattern,
  featureRoot,
  portalRoot,
  profileFileName,
  profileRoot,
} from './engineering-utils';

const appRoot = resolve(portalRoot, 'app');
const importPatterns = [
  /\bfrom\s+['"]([^'"]+)['"]/g,
  /\bimport\s+['"]([^'"]+)['"]/g,
  /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
];
const forbiddenPackages = ['antd', '@ant-design/icons', '@fa/ui', '@fa/icons'];

function walkSourceFiles(directory: string): readonly string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return walkSourceFiles(path);
    return /\.(?:ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

function collectImports(source: string): readonly string[] {
  const imports = new Set<string>();
  for (const pattern of importPatterns) {
    for (const match of source.matchAll(pattern)) imports.add(match[1]);
  }
  return [...imports];
}

function resolveImport(sourceFile: string, specifier: string): string | undefined {
  if (specifier.startsWith('.')) return resolve(dirname(sourceFile), specifier);
  if (specifier.startsWith('~/')) return resolve(appRoot, specifier.slice(2));
  return undefined;
}

function featureOwner(file: string): string | undefined {
  const featureRelative = relative(featureRoot, file);
  if (featureRelative.startsWith('..')) return undefined;
  const [owner] = featureRelative.split('/');
  return featureIdPattern.test(owner) ? owner : undefined;
}

function isFeaturePublicEntry(target: string): boolean {
  return basename(target).replace(/\.(?:ts|tsx)$/, '') === 'feature';
}

function visitRoutes(routes: readonly PortalRouteDefinition[], callback: (route: PortalRouteDefinition) => void): void {
  for (const route of routes) {
    callback(route);
    visitRoutes(route.children || [], callback);
  }
}

function validateCatalogDependencies(features: readonly PortalFeature[], errors: string[]): void {
  const featureById = new Map(features.map((feature) => [feature.id, feature]));
  for (const feature of features) {
    for (const dependency of feature.dependsOn || []) {
      if (!featureById.has(dependency)) errors.push(`Feature "${feature.id}" 声明了不存在的依赖 "${dependency}"`);
    }
    const replacementFeatureId = feature.lifecycle?.status === 'deprecated'
      ? feature.lifecycle.replacementFeatureId
      : undefined;
    if (replacementFeatureId && !featureById.has(replacementFeatureId)) {
      errors.push(`Feature "${feature.id}" 的替代 Feature "${replacementFeatureId}" 不存在`);
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (featureId: string, chain: readonly string[]) => {
    if (visiting.has(featureId)) {
      errors.push(`Feature 全目录依赖存在循环：${[...chain, featureId].join(' -> ')}`);
      return;
    }
    if (visited.has(featureId)) return;
    visiting.add(featureId);
    for (const dependency of featureById.get(featureId)?.dependsOn || []) visit(dependency, [...chain, featureId]);
    visiting.delete(featureId);
    visited.add(featureId);
  };
  for (const featureId of featureById.keys()) visit(featureId, []);
}

const errors: string[] = [];
const discoveredFeatures = await discoverFeatures();
const discoveredProfiles = await discoverProfiles();
const featureById = new Map(discoveredFeatures.map(({ feature }) => [feature.id, feature]));

for (const discovered of discoveredFeatures) {
  const directoryName = basename(discovered.directory);
  if (directoryName !== discovered.feature.id) {
    errors.push(`Feature 目录 "${directoryName}" 与 ID "${discovered.feature.id}" 不一致`);
  }
  for (const requiredPath of ['feature.ts', 'routes.ts', 'README.md', 'pages']) {
    if (!existsSync(resolve(discovered.directory, requiredPath))) {
      errors.push(`Feature "${discovered.feature.id}" 缺少 ${requiredPath}`);
    }
  }
  visitRoutes(discovered.feature.routes, (route) => {
    if (!route.file.startsWith(`features/${discovered.feature.id}/`)) {
      errors.push(`Feature "${discovered.feature.id}" 的路由 "${route.id}" 越界到 ${route.file}`);
    }
  });
}
validateCatalogDependencies(discoveredFeatures.map(({ feature }) => feature), errors);

for (const discovered of discoveredProfiles) {
  if (profileFileName(discovered) !== discovered.profile.id) {
    errors.push(`Profile 文件 "${profileFileName(discovered)}" 与 ID "${discovered.profile.id}" 不一致`);
  }
  for (const feature of discovered.profile.features) {
    if (!featureById.has(feature.id)) errors.push(`Profile "${discovered.profile.id}" 使用未登记 Feature "${feature.id}"`);
  }
}

for (const sourceFile of walkSourceFiles(appRoot)) {
  const source = readFileSync(sourceFile, 'utf8');
  const sourceOwner = featureOwner(sourceFile);
  const sourceIsProfile = sourceFile.startsWith(`${profileRoot}/`);

  if (sourceIsProfile && source.includes('import.meta.glob')) {
    errors.push(`Profile 禁止使用 import.meta.glob：${relative(portalRoot, sourceFile)}`);
  }
  if (sourceOwner && (source.includes('PORTAL_PROFILE') || source.includes('import.meta.env'))) {
    errors.push(`Feature 禁止读取 Profile 或环境装配变量：${relative(portalRoot, sourceFile)}`);
  }

  for (const specifier of collectImports(source)) {
    if (
      forbiddenPackages.some((packageName) => specifier === packageName || specifier.startsWith(`${packageName}/`))
    ) {
      errors.push(`Portal 禁止依赖 "${specifier}"：${relative(portalRoot, sourceFile)}`);
    }

    const target = resolveImport(sourceFile, specifier);
    if (!target) continue;
    if (target.includes('/apps/admin/')) {
      errors.push(`Portal 禁止导入 Admin 源码：${relative(portalRoot, sourceFile)} -> ${specifier}`);
    }
    if (sourceOwner && target.startsWith(`${profileRoot}/`)) {
      errors.push(`Feature 禁止导入 Profile：${relative(portalRoot, sourceFile)} -> ${specifier}`);
    }

    const targetOwner = featureOwner(target);
    if (!targetOwner) continue;
    if (sourceIsProfile) {
      if (!isFeaturePublicEntry(target)) {
        errors.push(`Profile 只能导入 Feature 公开入口：${relative(portalRoot, sourceFile)} -> ${specifier}`);
      }
      continue;
    }
    if (sourceOwner === targetOwner) continue;
    if (!sourceOwner) {
      errors.push(`非 Profile 模块禁止直接导入 Feature：${relative(portalRoot, sourceFile)} -> ${specifier}`);
      continue;
    }
    if (!isFeaturePublicEntry(target)) {
      errors.push(`Feature 禁止深层导入其他 Feature：${relative(portalRoot, sourceFile)} -> ${specifier}`);
      continue;
    }
    if (!featureById.get(sourceOwner)?.dependsOn?.includes(targetOwner)) {
      errors.push(`Feature "${sourceOwner}" 导入 "${targetOwner}" 前必须在 dependsOn 中声明`);
    }
  }
}

if (errors.length) throw new Error(`Portal 依赖边界检查失败：\n- ${errors.join('\n- ')}`);
console.log(
  `Portal dependency boundaries passed: features=${discoveredFeatures.length}, profiles=${discoveredProfiles.length}, sourceFiles=${walkSourceFiles(appRoot).length}`,
);

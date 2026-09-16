import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { portalComposition } from '../app/portal-profile';
import {
  assertBuildExists,
  buildDirectory,
  clientDirectory,
  deploymentDirectory,
  portalBaseUrl,
  resolveSiteUrl,
} from './build-utils';

const featureIdPattern = /(?:^|\/)app\/features\/(fa-[a-z0-9-]+-pages)\//;
const assetReferencePattern = /(?:href|src)=["']([^"']+)["']/g;

function fileExists(file: string): boolean {
  try {
    return statSync(file).isFile();
  } catch {
    return false;
  }
}

function validateModuleGraph(errors: string[]): string[] {
  const graphFile = resolve(buildDirectory, 'client-module-graph.json');
  if (!fileExists(graphFile)) {
    errors.push(`缺少客户端模块图：${relative(process.cwd(), graphFile)}`);
    return [];
  }

  const modules = (JSON.parse(readFileSync(graphFile, 'utf8')) as { modules?: unknown }).modules;
  if (!Array.isArray(modules) || !modules.every((moduleId) => typeof moduleId === 'string')) {
    errors.push(`客户端模块图格式无效：${relative(process.cwd(), graphFile)}`);
    return [];
  }

  const enabledFeatureIds = new Set(portalComposition.featureIds);
  const bundledFeatureIds = new Set<string>();
  for (const moduleId of modules) {
    const match = moduleId.match(featureIdPattern);
    if (match) bundledFeatureIds.add(match[1]);
    if (moduleId.includes('/apps/admin/') || moduleId.includes('/node_modules/antd/') || moduleId.includes('/packages/ui/')) {
      errors.push(`Portal 客户端模块图包含禁用依赖：${moduleId}`);
    }
  }

  for (const featureId of bundledFeatureIds) {
    if (!enabledFeatureIds.has(featureId)) errors.push(`产物包含未启用 Feature：${featureId}`);
  }
  return [...bundledFeatureIds].sort();
}

assertBuildExists();

const errors: string[] = [];
const indexFile = resolve(clientDirectory, 'index.html');
if (!fileExists(indexFile)) {
  errors.push('缺少 Vite SPA 入口：dist/index.html');
} else {
  const html = readFileSync(indexFile, 'utf8');
  if (!html.includes('<div id="root"></div>')) errors.push('Vite SPA 入口缺少 #root');
  for (const match of html.matchAll(assetReferencePattern)) {
    const reference = match[1];
    if (reference.startsWith(`${portalBaseUrl}assets/`)) {
      const asset = resolve(clientDirectory, reference.slice(portalBaseUrl.length));
      if (!fileExists(asset)) errors.push(`入口引用的资源不存在：${relative(process.cwd(), asset)}`);
    }
  }
}

if (!existsSync(resolve(clientDirectory, 'assets'))) errors.push('缺少 Vite assets 目录');
if (!fileExists(resolve(clientDirectory, 'sitemap.xml'))) errors.push('缺少 sitemap.xml');
if (!fileExists(resolve(clientDirectory, 'robots.txt'))) errors.push('缺少 robots.txt');

const deployedPortalDirectory = resolve(deploymentDirectory, 'portal');
for (const file of [
  resolve(deployedPortalDirectory, 'index.html'),
  resolve(deployedPortalDirectory, '__spa-fallback.html'),
  resolve(deployedPortalDirectory, 'favicon.svg'),
  resolve(deployedPortalDirectory, 'sitemap.xml'),
  resolve(deploymentDirectory, 'robots.txt'),
]) {
  if (!fileExists(file)) errors.push(`部署产物缺失：${relative(process.cwd(), file)}`);
}
if (!existsSync(resolve(deployedPortalDirectory, 'assets'))) errors.push('部署产物缺少 assets 目录');

const bundledFeatureIds = validateModuleGraph(errors);
const siteUrl = resolveSiteUrl();
const reportFile = resolve(buildDirectory, 'build-report.json');
writeFileSync(
  reportFile,
  `${JSON.stringify({
    profile: portalComposition.profile.id,
    routeCount: portalComposition.routes.length,
    bundledFeatureIds,
    siteUrl: siteUrl.value,
    siteUrlFallback: siteUrl.fallback,
    errors,
  }, null, 2)}\n`,
  'utf8',
);

if (errors.length) throw new Error(`Portal SPA 构建验收失败：\n- ${errors.join('\n- ')}`);
console.log(`Portal SPA build validation passed: profile=${portalComposition.profile.id}, routes=${portalComposition.routes.length}, report=${relative(process.cwd(), reportFile)}`);

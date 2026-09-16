import { gzipSync } from 'node:zlib';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { portalComposition } from '../app/portal-profile';
import {
  assertBuildExists,
  buildDirectory,
  clientDirectory,
  deploymentDirectory,
  portalBaseUrl,
  portalOutputDirectory,
  resolveSiteUrl,
} from './build-utils';

interface Budget {
  target: number;
  hard: number;
}

interface BudgetResult {
  label: string;
  value: number;
  budget: Budget;
  unit: 'KiB';
}

const budgets = {
  initialJavaScript: { target: 120, hard: 150 },
  initialCss: { target: 25, hard: 35 },
  asyncJavaScript: { target: 80, hard: 120 },
  image: { target: 200, hard: 300 },
} as const satisfies Record<string, Budget>;

const featureIdPattern = /(?:^|\/)app\/features\/(fa-[a-z0-9-]+-pages)\//;
const assetReferencePattern = /(?:href|src)=["']([^"']+)["']/g;

function walkFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = resolve(directory, entry.name);
    return entry.isDirectory() ? walkFiles(file) : [file];
  });
}

function normalizeRouteOutput(path: string): string {
  if (path === '/') return resolve(portalOutputDirectory, 'index.html');
  return resolve(portalOutputDirectory, path.replace(/^\/+/, ''), 'index.html');
}

function sizeInKiB(bytes: number): number {
  return Math.round((bytes / 1024) * 100) / 100;
}

function gzipSize(file: string): number {
  return gzipSync(readFileSync(file), { level: 9 }).byteLength;
}

function resolveAssetReference(reference: string): string | undefined {
  if (!reference.startsWith(portalBaseUrl) || !reference.includes('/assets/')) return undefined;
  return resolve(clientDirectory, reference.slice(portalBaseUrl.length));
}

function collectInitialAssets(html: string): string[] {
  const assets = new Set<string>();
  for (const match of html.matchAll(assetReferencePattern)) {
    const asset = resolveAssetReference(match[1]);
    if (asset) assets.add(asset);
  }
  return [...assets];
}

function createBudgetResult(label: string, bytes: number, budget: Budget): BudgetResult {
  return { label, value: sizeInKiB(bytes), budget, unit: 'KiB' };
}

function validateBudget(result: BudgetResult, errors: string[], warnings: string[]): void {
  const description = `${result.label}: ${result.value} ${result.unit}（目标 ${result.budget.target}，硬上限 ${result.budget.hard}）`;
  if (result.value > result.budget.hard) errors.push(`超出硬上限：${description}`);
  else if (result.value > result.budget.target) warnings.push(`超过目标值：${description}`);
}

function validatePrerenderedHtml(siteUrl: string, requireAbsoluteUrls: boolean, errors: string[]): void {
  for (const path of portalComposition.prerenderPaths) {
    const output = normalizeRouteOutput(path);
    if (!statSafe(output)) {
      errors.push(`缺少预渲染页面：${path} -> ${relative(process.cwd(), output)}`);
      continue;
    }

    const html = readFileSync(output, 'utf8');
    const canonical = new URL(path.replace(/^\/+/, ''), siteUrl).toString();
    const checks: [string, boolean][] = [
      ['主要正文', /<main[\s>]/.test(html) && /<h1[\s>]/.test(html)],
      ['title', /<title>[^<]+<\/title>/.test(html)],
      ['description', /<meta name="description" content="[^"]+"/.test(html)],
      ['Open Graph', /<meta property="og:title" content="[^"]+"/.test(html)],
      ['JSON-LD', html.includes('type="application/ld+json"') && html.includes('https://schema.org')],
    ];
    if (requireAbsoluteUrls) {
      checks.push(
        ['canonical', html.includes(`rel="canonical" href="${canonical}"`)],
        ['Open Graph URL', html.includes(`property="og:url" content="${canonical}"`)],
      );
    }

    for (const [label, passed] of checks) {
      if (!passed) errors.push(`预渲染页面 ${path} 缺少${label}`);
    }
  }
}

function statSafe(file: string): boolean {
  try {
    return statSync(file).isFile();
  } catch {
    return false;
  }
}

function validateClientModuleGraph(errors: string[]): readonly string[] {
  const moduleGraphFile = resolve(buildDirectory, 'client-module-graph.json');
  if (!statSafe(moduleGraphFile)) {
    errors.push(`缺少客户端模块图：${relative(process.cwd(), moduleGraphFile)}`);
    return [];
  }

  let modules: unknown;
  try {
    modules = (JSON.parse(readFileSync(moduleGraphFile, 'utf8')) as { modules?: unknown }).modules;
  } catch {
    errors.push(`客户端模块图无法解析：${relative(process.cwd(), moduleGraphFile)}`);
    return [];
  }
  if (!Array.isArray(modules) || !modules.every((moduleId) => typeof moduleId === 'string')) {
    errors.push(`客户端模块图格式无效：${relative(process.cwd(), moduleGraphFile)}`);
    return [];
  }

  const enabledFeatureIds = new Set(portalComposition.featureIds);
  const bundledFeatureIds = new Set<string>();
  for (const moduleId of modules) {
    const featureMatch = moduleId.match(featureIdPattern);
    if (featureMatch) bundledFeatureIds.add(featureMatch[1]);

    if (
      moduleId.includes('/apps/admin/') ||
      moduleId.includes('/node_modules/antd/') ||
      moduleId.includes('/node_modules/@ant-design/icons/') ||
      moduleId.includes('/packages/ui/')
    ) {
      errors.push(`Portal 客户端模块图包含禁用依赖：${moduleId}`);
    }
  }

  for (const featureId of bundledFeatureIds) {
    if (!enabledFeatureIds.has(featureId)) errors.push(`Profile "${portalComposition.profile.id}" 产物残留未启用 Feature：${featureId}`);
  }

  return [...bundledFeatureIds].sort();
}

function validateDeploymentOutput(errors: string[]): void {
  const deployedPortalDirectory = resolve(deploymentDirectory, 'portal');
  const expectedFiles = [
    resolve(deploymentDirectory, 'robots.txt'),
    resolve(deployedPortalDirectory, 'favicon.svg'),
    resolve(deployedPortalDirectory, 'sitemap.xml'),
    resolve(deployedPortalDirectory, '__spa-fallback.html'),
    resolve(deployedPortalDirectory, 'assets'),
    ...portalComposition.prerenderPaths.map((path) =>
      path === '/' ? resolve(deployedPortalDirectory, 'index.html') : resolve(deployedPortalDirectory, path.replace(/^\/+/, ''), 'index.html'),
    ),
  ];

  for (const file of expectedFiles) {
    if (!existsSafe(file)) errors.push(`部署产物缺失：${relative(process.cwd(), file)}`);
  }

  const fallbackFile = resolve(deployedPortalDirectory, '__spa-fallback.html');
  if (statSafe(fallbackFile) && !readFileSync(fallbackFile, 'utf8').includes('"isSpaMode":true')) {
    errors.push('部署产物中的 __spa-fallback.html 不是 React Router SPA fallback');
  }
}

function existsSafe(file: string): boolean {
  try {
    statSync(file);
    return true;
  } catch {
    return false;
  }
}

assertBuildExists();

const errors: string[] = [];
const warnings: string[] = portalComposition.warnings.map((warning) => `Feature 生命周期：${warning}`);
const siteUrl = resolveSiteUrl();
const homeHtmlFile = normalizeRouteOutput('/');
if (!statSafe(homeHtmlFile)) throw new Error(`Portal 首页预渲染产物不存在：${homeHtmlFile}`);

const homeHtml = readFileSync(homeHtmlFile, 'utf8');
const initialAssets = collectInitialAssets(homeHtml);
const missingInitialAssets = initialAssets.filter((file) => !statSafe(file));
if (missingInitialAssets.length) {
  errors.push(...missingInitialAssets.map((file) => `首页引用的资源不存在：${relative(process.cwd(), file)}`));
}

const validInitialAssets = initialAssets.filter(statSafe);
const initialJavaScriptBytes = validInitialAssets.filter((file) => file.endsWith('.js')).reduce((total, file) => total + gzipSize(file), 0);
const initialCssBytes = validInitialAssets.filter((file) => file.endsWith('.css')).reduce((total, file) => total + gzipSize(file), 0);
const assetDirectory = resolve(clientDirectory, 'assets');
const assetFiles = statSync(assetDirectory).isDirectory() ? walkFiles(assetDirectory) : [];
const javascriptFiles = assetFiles.filter((file) => file.endsWith('.js'));
const imageFiles = walkFiles(clientDirectory).filter((file) => /\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(file));
const largestJavaScriptFile = javascriptFiles.reduce(
  (largest, file) => (gzipSize(file) > largest.bytes ? { file, bytes: gzipSize(file) } : largest),
  { file: '', bytes: 0 },
);
const largestImageFile = imageFiles.reduce(
  (largest, file) => (statSync(file).size > largest.bytes ? { file, bytes: statSync(file).size } : largest),
  { file: '', bytes: 0 },
);
const results = [
  createBudgetResult('首页初始 JavaScript（gzip）', initialJavaScriptBytes, budgets.initialJavaScript),
  createBudgetResult('首页初始 CSS（gzip）', initialCssBytes, budgets.initialCss),
  createBudgetResult('最大 JavaScript Chunk（gzip）', largestJavaScriptFile.bytes, budgets.asyncJavaScript),
  createBudgetResult('最大图片（原始大小）', largestImageFile.bytes, budgets.image),
];

for (const result of results) validateBudget(result, errors, warnings);
validatePrerenderedHtml(siteUrl.value, !siteUrl.fallback, errors);
const bundledFeatureIds = validateClientModuleGraph(errors);
validateDeploymentOutput(errors);

const fallbackFile = resolve(clientDirectory, 'index.html');
if (!statSafe(fallbackFile) || !readFileSync(fallbackFile, 'utf8').includes('window.__reactRouterContext')) {
  errors.push('缺少可用的 SPA fallback：dist/client/index.html');
}
if (!statSafe(resolve(portalOutputDirectory, 'sitemap.xml'))) errors.push('缺少 sitemap.xml');
if (!statSafe(resolve(clientDirectory, 'robots.txt'))) errors.push('缺少站点根路径 robots.txt');
if (siteUrl.fallback) warnings.push(`VITE_PORTAL_SITE_URL 未配置，当前 SEO URL 使用 ${siteUrl.value}`);

const reportFile = resolve(buildDirectory, 'build-report.json');
writeFileSync(
  reportFile,
  `${JSON.stringify(
    {
      profile: portalComposition.profile.id,
      siteUrl: siteUrl.value,
      siteUrlFallback: siteUrl.fallback,
      prerenderPaths: portalComposition.prerenderPaths,
      bundledFeatureIds,
      initialAssets: initialAssets.map((file) => relative(clientDirectory, file)),
      largestJavaScriptChunk: largestJavaScriptFile.file
        ? { file: relative(clientDirectory, largestJavaScriptFile.file), gzipKiB: sizeInKiB(largestJavaScriptFile.bytes) }
        : null,
      largestImage: largestImageFile.file ? { file: relative(clientDirectory, largestImageFile.file), sizeKiB: sizeInKiB(largestImageFile.bytes) } : null,
      budgets: results,
      warnings,
      errors,
    },
    null,
    2,
  )}\n`,
  'utf8',
);

console.table(
  results.map((result) => ({
    指标: result.label,
    当前值: `${result.value} ${result.unit}`,
    目标值: `${result.budget.target} ${result.unit}`,
    硬上限: `${result.budget.hard} ${result.unit}`,
  })),
);
for (const warning of warnings) console.warn(`Portal build warning: ${warning}`);

if (errors.length) {
  throw new Error(`Portal 构建验收失败：\n- ${errors.join('\n- ')}`);
}

console.log(
  `Portal build validation passed: profile=${portalComposition.profile.id}, prerender=${portalComposition.prerenderPaths.length}, initialAssets=${initialAssets.length}, report=${relative(process.cwd(), reportFile)}`,
);

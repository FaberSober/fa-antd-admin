import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { PortalRouteDefinition } from '../app/kernel/feature';
import { discoverFeatures, discoverProfiles, isDirectExecution, portalRoot } from './engineering-utils';

const outputFile = resolve(portalRoot, 'docs', 'feature-catalog.generated.md');

function normalizeRoute(parent: string, route: PortalRouteDefinition): string {
  if (route.index) return parent || '/';
  const child = route.path || '';
  return `/${[parent, child].join('/').split('/').filter(Boolean).join('/')}`;
}

function flattenRoutes(routes: readonly PortalRouteDefinition[], parent = ''): readonly string[] {
  return routes.flatMap((route) => {
    const path = normalizeRoute(parent, route);
    return [path, ...flattenRoutes(route.children || [], path)];
  });
}

async function renderCatalog(): Promise<string> {
  const features = await discoverFeatures();
  const profiles = await discoverProfiles();
  const profileIdsByFeature = new Map<string, string[]>();
  for (const { profile } of profiles) {
    for (const feature of profile.features) {
      const profileIds = profileIdsByFeature.get(feature.id) || [];
      profileIds.push(profile.id);
      profileIdsByFeature.set(feature.id, profileIds);
    }
  }

  const featureRows = features.map(({ feature }) => {
    const lifecycle = feature.lifecycle?.status === 'deprecated'
      ? `deprecated since ${feature.lifecycle.since}`
      : 'active';
    const dependencies = feature.dependsOn?.length ? feature.dependsOn.map((id) => `\`${id}\``).join('、') : '—';
    const routes = flattenRoutes(feature.routes).map((path) => `\`${path}\``).join('、') || '—';
    const profileIds = profileIdsByFeature.get(feature.id)?.map((id) => `\`${id}\``).join('、') || '—';
    return `| \`${feature.id}\` | ${lifecycle} | ${dependencies} | ${routes} | ${feature.prerenderPaths?.length || 0} | ${profileIds} |`;
  });
  const profileRows = profiles.map(({ profile }) =>
    `| \`${profile.id}\` | ${profile.site.name} | ${profile.features.map((feature) => `\`${feature.id}\``).join('、')} |`,
  );
  const dependencyLines = features.flatMap(({ feature }) =>
    (feature.dependsOn || []).map((dependency) => `  "${feature.id}" --> "${dependency}"`),
  );

  return `# Portal Feature 与 Profile 目录

> 此文件由 \`scripts/generate-feature-catalog.ts\` 生成。修改 Feature/Profile 后执行 \`pnpm --filter @fa/portal generate:catalog\`，CI 使用 \`check:catalog\` 防止文档漂移。

## Feature 目录

| Feature | 生命周期 | 依赖 | 路由 | 预渲染数 | 启用 Profile |
|---|---|---|---|---:|---|
${featureRows.join('\n')}

## 依赖关系

\`\`\`mermaid
graph LR
${dependencyLines.length ? dependencyLines.join('\n') : '  "features"'}
\`\`\`

箭头表示“左侧 Feature 依赖右侧 Feature”。代码级跨 Feature 引用还必须只指向目标 \`feature.ts\` 公开入口。

## Profile 组合

| Profile | 站点名称 | Feature |
|---|---|---|
${profileRows.join('\n')}

## 维护规则

- Feature 目录名必须等于 Feature ID。
- Profile 文件名必须等于 Profile ID，并静态导入 Feature 的 \`feature.ts\`。
- 新增、删除、废弃 Feature 或修改 Profile 后必须重新生成本文件。
- 自动边界规则和人工完成定义见 \`phase-6-engineering.md\`。
`;
}

async function main(): Promise<void> {
  const expected = await renderCatalog();
  if (process.argv.includes('--check')) {
    if (!existsSync(outputFile) || readFileSync(outputFile, 'utf8') !== expected) {
      throw new Error(`Feature 目录文档已过期，请执行 pnpm --filter @fa/portal generate:catalog：${outputFile}`);
    }
    console.log('Portal feature catalog is up to date');
    return;
  }
  writeFileSync(outputFile, expected, 'utf8');
  console.log(`Portal feature catalog generated: ${outputFile}`);
}

export { renderCatalog };

if (isDirectExecution(import.meta.url)) await main();

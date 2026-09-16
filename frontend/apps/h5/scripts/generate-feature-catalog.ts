import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { composeH5Project } from '../src/platform/feature/compose';
import { discoverFeatureIds, discoverProjectIds, h5Root, loadFeature, loadProject } from './engineering-utils';

const outputFile = path.join(h5Root, 'docs/feature-catalog.generated.md');
const featureIds = await discoverFeatureIds();
const projectIds = await discoverProjectIds();
const lines = [
  '# H5 Feature / Project 目录',
  '',
  '> 此文件由 `pnpm catalog:generate` 生成，请勿手工修改。',
  '',
  '## Features',
  '',
  '| Feature ID | 名称 | 依赖 | 路由 | 生命周期 |',
  '|---|---|---|---:|---|',
];

for (const featureId of featureIds) {
  const feature = await loadFeature(featureId);
  lines.push(
    `| \`${feature.id}\` | ${feature.displayName} | ${
      feature.dependsOn?.map((id) => `\`${id}\``).join('、') || '-'
    } | ${feature.routes.length} | ${feature.lifecycle?.status ?? 'active'} |`,
  );
}

lines.push('', '## Projects', '', '| Project ID | 标题 | 默认路由 | Features |', '|---|---|---|---|');

for (const projectId of projectIds) {
  const registry = composeH5Project(await loadProject(projectId));
  lines.push(
    `| \`${registry.project.id}\` | ${registry.project.title} | \`${
      registry.project.defaultRouteId
    }\` | ${registry.featureIds.map((id) => `\`${id}\``).join('、')} |`,
  );
}

lines.push('', '## Routes', '', '| Project | Route ID | Path | Permission |', '|---|---|---|---|');

for (const projectId of projectIds) {
  const registry = composeH5Project(await loadProject(projectId));
  for (const route of registry.routes) {
    lines.push(`| \`${projectId}\` | \`${route.id}\` | \`${route.path}\` | ${route.permission ? `\`${route.permission}\`` : '-'} |`);
  }
}

const generated = `${lines.join('\n')}\n`;
if (process.argv.includes('--check')) {
  const current = await readFile(outputFile, 'utf8').catch(() => '');
  if (current !== generated) {
    throw new Error('Feature 目录已过期，请执行 pnpm catalog:generate');
  }
  console.log('[H5 Catalog] docs/feature-catalog.generated.md 已同步');
} else {
  await writeFile(outputFile, generated, 'utf8');
  console.log('[H5 Catalog] 已生成 docs/feature-catalog.generated.md');
}

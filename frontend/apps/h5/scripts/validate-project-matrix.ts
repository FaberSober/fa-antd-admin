import { composeH5Project } from '../src/platform/feature/compose';
import { discoverFeatureIds, discoverProjectIds, loadProject } from './engineering-utils';

const projectIds = await discoverProjectIds();
const discoveredFeatureIds = new Set(await discoverFeatureIds());
const referencedFeatureIds = new Set<string>();

if (projectIds.length < 2) {
  throw new Error('M2 至少需要两个 Project 预设验证不同 Feature 组合');
}

for (const projectId of projectIds) {
  const project = await loadProject(projectId);
  const registry = composeH5Project(project);
  if (project.id !== projectId) {
    throw new Error(`Project 文件 "${projectId}.ts" 的 project.id 必须同名，当前为 "${project.id}"`);
  }
  for (const featureId of registry.featureIds) {
    if (!discoveredFeatureIds.has(featureId)) {
      throw new Error(`Project "${projectId}" 引用了目录中不存在的 Feature "${featureId}"`);
    }
    referencedFeatureIds.add(featureId);
  }
  console.log(`[H5 Matrix] ${projectId.padEnd(12)} ${registry.featureIds.join(', ')} (${registry.routes.length} routes)`);
}

for (const featureId of discoveredFeatureIds) {
  if (!referencedFeatureIds.has(featureId)) {
    throw new Error(`Feature "${featureId}" 未被任何 Project 预设引用`);
  }
}

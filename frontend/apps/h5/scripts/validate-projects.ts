import { composeH5Project } from '../src/platform/feature/compose';
import { defineH5Feature, defineH5Project } from '../src/platform/feature/define';
import type { H5Feature, H5FeatureId, H5HomeEntry, H5NavItem, H5RouteDefinition } from '../src/platform/feature/types';
import { loadProject, resolveProjectId } from './engineering-utils';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`[H5 Project Test] ${message}`);
  }
}

function expectCompositionError(label: string, compose: () => unknown, expectedText: string): void {
  try {
    compose();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    assert(message.includes(expectedText), `${label} 错误信息缺少 "${expectedText}"：${message}`);
    return;
  }
  throw new Error(`[H5 Project Test] ${label} 应当失败`);
}

function createRoute(featureId: H5FeatureId, name: string, path: `/${string}`): H5RouteDefinition {
  return {
    id: `${featureId}.${name}`,
    path,
    access: 'authenticated',
    permission: `/h5${path}`,
    title: name,
    lazy: async () => ({ default: () => null }),
  };
}

function createFeature(
  featureId: H5FeatureId,
  path: `/${string}`,
  options: {
    dependsOn?: readonly H5FeatureId[];
    navItems?: readonly H5NavItem[];
    homeEntries?: readonly H5HomeEntry[];
  } = {},
): H5Feature {
  return defineH5Feature({
    id: featureId,
    displayName: featureId,
    dependsOn: options.dependsOn,
    routes: [createRoute(featureId, 'main', path)],
    navItems: options.navItems,
    homeEntries: options.homeEntries,
  });
}

function createFixtureProject(features: readonly H5Feature[]) {
  return defineH5Project({
    id: 'fixture',
    title: 'Fixture',
    basePath: '/h5',
    defaultRouteId: features[0].routes[0].id,
    features,
  });
}

const defaultRegistry = composeH5Project(await loadProject('default'));
const demoRegistry = composeH5Project(await loadProject('demo'));

assert(
  defaultRegistry.featureIds.join(',') === 'fa-h5-base-pages,fa-h5-file-preview-pages,fa-h5-demo-pages',
  'default 项目必须启用 base + file preview + demo Feature',
);
assert(
  demoRegistry.featureIds.join(',') === 'fa-h5-base-pages,fa-h5-file-preview-pages,fa-h5-demo-pages',
  'demo 项目必须启用 base + file preview + demo Feature',
);
assert(defaultRegistry.routeMap.has('fa-h5-demo-pages.overview'), 'default 应注册 demo 列表路由');
assert(defaultRegistry.routeMap.has('fa-h5-demo-pages.button'), 'default 应注册 button demo 路由');
assert(demoRegistry.routeMap.has('fa-h5-demo-pages.overview'), 'demo 应注册 demo 列表路由');
assert(demoRegistry.routeMap.has('fa-h5-demo-pages.button'), 'demo 应注册 button demo 路由');
assert(Object.isFrozen(defaultRegistry), 'Registry 顶层必须不可变');
assert(Object.isFrozen(defaultRegistry.project), 'Registry project 必须不可变');
assert(Object.isFrozen(defaultRegistry.routes), 'Registry routes 必须不可变');
assert(typeof (defaultRegistry.featureMap as Map<string, H5Feature>).set !== 'function', 'Registry featureMap 不能暴露 set');

const duplicateFeature = createFeature('fa-duplicate-h5-pages', '/app/duplicate');
expectCompositionError('重复 Feature', () => composeH5Project(createFixtureProject([duplicateFeature, duplicateFeature])), 'feature.id');

const missingDependency = createFeature('fa-missing-h5-pages', '/app/missing', {
  dependsOn: ['fa-not-enabled-h5-pages'],
});
expectCompositionError('缺失依赖', () => composeH5Project(createFixtureProject([missingDependency])), '未启用');

const cycleA = createFeature('fa-cycle-a-h5-pages', '/app/cycle-a', {
  dependsOn: ['fa-cycle-b-h5-pages'],
});
const cycleB = createFeature('fa-cycle-b-h5-pages', '/app/cycle-b', {
  dependsOn: ['fa-cycle-a-h5-pages'],
});
expectCompositionError('循环依赖', () => composeH5Project(createFixtureProject([cycleA, cycleB])), '形成循环');

const dynamicA = createFeature('fa-dynamic-a-h5-pages', '/app/items/:itemId');
const dynamicB = createFeature('fa-dynamic-b-h5-pages', '/app/items/:recordId');
expectCompositionError('动态路由冲突', () => composeH5Project(createFixtureProject([dynamicA, dynamicB])), 'route.path');

const entryRouteA = createRoute('fa-entry-a-h5-pages', 'main', '/app/entry-a');
const entryRouteB = createRoute('fa-entry-b-h5-pages', 'main', '/app/entry-b');
const entryA = defineH5Feature({
  id: 'fa-entry-a-h5-pages',
  displayName: 'Entry A',
  routes: [entryRouteA],
  navItems: [{ id: 'shared-entry', routeId: entryRouteA.id, label: 'A' }],
  homeEntries: [{ id: 'shared-home', routeId: entryRouteA.id, title: 'A' }],
});
const entryB = defineH5Feature({
  id: 'fa-entry-b-h5-pages',
  displayName: 'Entry B',
  routes: [entryRouteB],
  navItems: [{ id: 'shared-entry', routeId: entryRouteB.id, label: 'B' }],
  homeEntries: [{ id: 'shared-home', routeId: entryRouteB.id, title: 'B' }],
});
expectCompositionError('导航入口冲突', () => composeH5Project(createFixtureProject([entryA, entryB])), 'navItems.id');

expectCompositionError('非法项目名', () => resolveProjectId('../demo'), '只允许');
expectCompositionError('不存在项目', () => resolveProjectId('not-found'), '不存在');

assert(defaultRegistry.routeMap.has('fa-h5-file-preview-pages.preview'), 'default 应注册文件预览路由');
assert(demoRegistry.routeMap.has('fa-h5-file-preview-pages.preview'), 'demo 应注册文件预览路由');

console.log('[H5 Project Test] 2 个项目预设、5 组组合冲突和项目选择校验通过');

import { defineH5Feature, defineH5Project } from './define';
import { H5FeatureCompositionError } from './errors';
import { ImmutableMap } from './readonly-map';
import type { H5Feature, H5FeatureId, H5FeatureMigration, H5HomeEntry, H5NavItem, H5Project, H5Registry, H5RouteDefinition, H5RouteId } from './types';

const projectIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const featureIdPattern = /^(?:fa-h5-[a-z0-9]+(?:-[a-z0-9]+)*-pages|fa-[a-z0-9]+(?:-[a-z0-9]+)*-h5-pages)$/;
const platformAuthenticatedPaths = new Set(['/app/home', '/app/me']);
const defaultOrder = 1000;

function fail(message: string): never {
  throw new H5FeatureCompositionError(message);
}

function assertNonEmpty(value: string, fieldPath: string): void {
  if (!value.trim()) {
    fail(`${fieldPath} 不能为空`);
  }
}

function compareOrdered<T extends { id: string; order?: number }>(left: T, right: T): number {
  return (left.order ?? defaultOrder) - (right.order ?? defaultOrder) || left.id.localeCompare(right.id);
}

function canonicalizeRoutePath(path: string): string {
  return path.replace(/:[^/]+/g, ':param');
}

function validateProjectHeader(project: H5Project): void {
  if (!projectIdPattern.test(project.id)) {
    fail(`project.id "${project.id}" 只允许小写字母、数字和连字符`);
  }
  assertNonEmpty(project.title, `project "${project.id}".title`);
  if (project.basePath !== '/h5') {
    fail(`project "${project.id}".basePath 必须为 "/h5"`);
  }
  if (project.features.length === 0) {
    fail(`project "${project.id}".features 至少需要一个 Feature`);
  }
}

function validateFeatureHeader(feature: H5Feature): void {
  if (!featureIdPattern.test(feature.id)) {
    fail(`feature.id "${feature.id}" 不符合 fa-h5-<platform>-pages 或 fa-<domain>-h5-pages`);
  }
  assertNonEmpty(feature.displayName, `feature "${feature.id}".displayName`);
  if (feature.routes.length === 0) {
    fail(`feature "${feature.id}".routes 至少需要一个路由`);
  }
}

function validateRoute(feature: H5Feature, route: H5RouteDefinition): void {
  if (!route.id.startsWith(`${feature.id}.`)) {
    fail(`feature "${feature.id}".route "${route.id}" 必须以 "${feature.id}." 开头`);
  }
  if (!route.path.startsWith('/') || route.path.startsWith('/h5')) {
    fail(`route "${route.id}".path 必须是 basename 之后的绝对内部路径`);
  }
  if (route.path !== '/' && route.path.endsWith('/')) {
    fail(`route "${route.id}".path 不能以 "/" 结尾`);
  }
  assertNonEmpty(route.title, `route "${route.id}".title`);

  if (route.permission && !route.permission.startsWith('/h5/')) {
    fail(`route "${route.id}".permission 必须以 "/h5/" 开头`);
  }
  if (route.access === 'authenticated' && !platformAuthenticatedPaths.has(route.path) && !route.permission) {
    fail(`authenticated 业务路由 "${route.id}" 必须声明 permission`);
  }
}

function assertUnique(seen: Map<string, string>, value: string, owner: string, fieldName: string): void {
  const existingOwner = seen.get(value);
  if (existingOwner) {
    fail(`${fieldName} "${value}" 冲突：${existingOwner} 与 ${owner}`);
  }
  seen.set(value, owner);
}

function validateDependencies(features: readonly H5Feature[], featureMap: ReadonlyMap<H5FeatureId, H5Feature>): void {
  for (const feature of features) {
    const localDependencies = new Set<H5FeatureId>();
    for (const dependencyId of feature.dependsOn ?? []) {
      if (dependencyId === feature.id) {
        fail(`feature "${feature.id}".dependsOn 不能依赖自身`);
      }
      if (localDependencies.has(dependencyId)) {
        fail(`feature "${feature.id}".dependsOn 重复声明 "${dependencyId}"`);
      }
      if (!featureMap.has(dependencyId)) {
        fail(`feature "${feature.id}".dependsOn 未启用 "${dependencyId}"`);
      }
      localDependencies.add(dependencyId);
    }
  }

  const visiting = new Set<H5FeatureId>();
  const visited = new Set<H5FeatureId>();

  function visit(featureId: H5FeatureId, path: readonly H5FeatureId[]): void {
    if (visiting.has(featureId)) {
      fail(`Feature 依赖形成循环：${[...path, featureId].join(' -> ')}`);
    }
    if (visited.has(featureId)) {
      return;
    }

    visiting.add(featureId);
    const feature = featureMap.get(featureId);
    for (const dependencyId of feature?.dependsOn ?? []) {
      visit(dependencyId, [...path, featureId]);
    }
    visiting.delete(featureId);
    visited.add(featureId);
  }

  for (const feature of features) {
    visit(feature.id, []);
  }
}

function validateEntryReference(
  entry: H5NavItem | H5HomeEntry,
  entryType: 'navItems' | 'homeEntries',
  routeMap: ReadonlyMap<H5RouteId, H5RouteDefinition>,
): void {
  const route = routeMap.get(entry.routeId);
  if (!route) {
    fail(`${entryType} "${entry.id}" 引用了未注册 routeId "${entry.routeId}"`);
  }
  if (entryType === 'navItems' && route.access === 'public') {
    fail(`navItems "${entry.id}" 不能引用 public route "${entry.routeId}"`);
  }
}

function validateLifecycle(project: H5Project, features: readonly H5Feature[], featureMap: ReadonlyMap<H5FeatureId, H5Feature>): readonly string[] {
  const migrations = new Map<H5FeatureId, H5FeatureMigration>();
  for (const migration of project.featureMigrations ?? []) {
    assertNonEmpty(migration.acknowledgedIn, `featureMigrations "${migration.featureId}".acknowledgedIn`);
    if (migrations.has(migration.featureId)) {
      fail(`featureMigrations 重复确认 "${migration.featureId}"`);
    }
    migrations.set(migration.featureId, migration);
  }

  const warnings: string[] = [];
  for (const feature of features) {
    const lifecycle = feature.lifecycle ?? { status: 'active' as const };
    const migration = migrations.get(feature.id);

    if (lifecycle.status === 'active') {
      if (migration) {
        fail(`active feature "${feature.id}" 不应存在 featureMigrations 确认`);
      }
      continue;
    }

    assertNonEmpty(lifecycle.since, `feature "${feature.id}".lifecycle.since`);
    assertNonEmpty(lifecycle.reason, `feature "${feature.id}".lifecycle.reason`);
    assertNonEmpty(lifecycle.migrationGuide, `feature "${feature.id}".lifecycle.migrationGuide`);
    if (lifecycle.replacementFeatureId === feature.id) {
      fail(`deprecated feature "${feature.id}" 的 replacementFeatureId 不能指向自身`);
    }
    if (!migration) {
      fail(`project "${project.id}" 启用 deprecated feature "${feature.id}" 前必须确认 featureMigrations`);
    }
    if (migration.targetFeatureId !== lifecycle.replacementFeatureId) {
      fail(`featureMigrations "${feature.id}".targetFeatureId 与 replacementFeatureId 不一致`);
    }
    if (migration.targetFeatureId && !featureMap.has(migration.targetFeatureId)) {
      fail(`featureMigrations "${feature.id}".targetFeatureId "${migration.targetFeatureId}" 未启用`);
    }

    const target = lifecycle.removalVersion ? `，计划移除版本 ${lifecycle.removalVersion}` : '';
    warnings.push(`project "${project.id}" 在 ${migration.acknowledgedIn} 确认继续使用 deprecated feature "${feature.id}"${target}`);
  }

  for (const migrationId of migrations.keys()) {
    if (!featureMap.has(migrationId)) {
      fail(`featureMigrations "${migrationId}" 对应的 Feature 未启用`);
    }
  }

  return Object.freeze(warnings);
}

export function composeH5Project(project: H5Project): H5Registry {
  validateProjectHeader(project);

  const featureIdOwners = new Map<string, string>();
  const features = project.features.map((feature) => defineH5Feature(feature)).sort(compareOrdered);
  for (const feature of features) {
    validateFeatureHeader(feature);
    assertUnique(featureIdOwners, feature.id, `project "${project.id}"`, 'feature.id');
  }
  const immutableProject = defineH5Project({ ...project, features });

  const mutableFeatureMap = new Map<H5FeatureId, H5Feature>(features.map((feature) => [feature.id, feature]));
  const featureMap = new ImmutableMap(mutableFeatureMap);
  validateDependencies(features, featureMap);

  const routeIds = new Map<string, string>();
  const routePaths = new Map<string, string>();
  const routePermissions = new Map<string, string>();
  const routes: H5RouteDefinition[] = [];

  for (const feature of features) {
    for (const route of feature.routes) {
      validateRoute(feature, route);
      assertUnique(routeIds, route.id, `feature "${feature.id}"`, 'route.id');
      assertUnique(routePaths, canonicalizeRoutePath(route.path), `route "${route.id}"`, 'route.path');
      if (route.permission) {
        assertUnique(routePermissions, route.permission, `route "${route.id}"`, 'route.permission');
      }
      routes.push(route);
    }
  }

  const mutableRouteMap = new Map<H5RouteId, H5RouteDefinition>(routes.map((route) => [route.id, route]));
  const routeMap = new ImmutableMap(mutableRouteMap);
  if (!routeMap.has(immutableProject.defaultRouteId)) {
    fail(`project "${immutableProject.id}".defaultRouteId "${immutableProject.defaultRouteId}" 未注册`);
  }

  const navIds = new Map<string, string>();
  const homeEntryIds = new Map<string, string>();
  const navItems: H5NavItem[] = [];
  const homeEntries: H5HomeEntry[] = [];

  for (const feature of features) {
    for (const item of feature.navItems ?? []) {
      assertNonEmpty(item.label, `feature "${feature.id}".navItems "${item.id}".label`);
      assertUnique(navIds, item.id, `feature "${feature.id}"`, 'navItems.id');
      validateEntryReference(item, 'navItems', routeMap);
      navItems.push(item);
    }
    for (const item of feature.homeEntries ?? []) {
      assertNonEmpty(item.title, `feature "${feature.id}".homeEntries "${item.id}".title`);
      assertUnique(homeEntryIds, item.id, `feature "${feature.id}"`, 'homeEntries.id');
      validateEntryReference(item, 'homeEntries', routeMap);
      homeEntries.push(item);
    }
  }

  navItems.sort(compareOrdered);
  homeEntries.sort(compareOrdered);
  const lifecycleWarnings = validateLifecycle(immutableProject, features, featureMap);

  return Object.freeze({
    project: immutableProject,
    featureIds: Object.freeze(features.map((feature) => feature.id)),
    featureMap,
    routeMap,
    routes: Object.freeze(routes),
    navItems: Object.freeze(navItems),
    homeEntries: Object.freeze(homeEntries),
    lifecycleWarnings,
  });
}

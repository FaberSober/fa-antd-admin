import { PortalFeatureConfigurationError } from './errors';
import type { ComposePortalProfileOptions, PortalComposition, PortalFeature, PortalNavigationItem, PortalProfile, PortalRouteDefinition } from './types';

const FEATURE_ID_PATTERN = /^[a-z][a-z0-9-]*$/;
const CONTRACT_ID_PATTERN = /^[a-z][a-z0-9.-]*$/;

interface OwnedRoute {
  owner: string;
  route: PortalRouteDefinition;
}

function fail(message: string): never {
  throw new PortalFeatureConfigurationError(message);
}

function validateContractId(value: string, type: string, pattern = CONTRACT_ID_PATTERN): void {
  if (!pattern.test(value)) fail(`${type} "${value}" 命名无效`);
}

function normalizePath(path: string): string {
  const pathOnly = path.split(/[?#]/, 1)[0] || '/';
  const normalized = `/${pathOnly}`.replace(/\/{2,}/g, '/');
  return normalized.length > 1 ? normalized.replace(/\/$/, '') : normalized;
}

function joinRoutePath(parentPath: string, route: PortalRouteDefinition): string {
  if (route.index) return parentPath || '/';

  const childPath = route.path || '';
  if (childPath.startsWith('/')) return normalizePath(childPath);
  return normalizePath(`${parentPath}/${childPath}`);
}

function canonicalizeRoutePath(path: string): string {
  return normalizePath(path)
    .split('/')
    .map((segment) => {
      if (segment.startsWith(':')) return segment.endsWith('?') ? ':param?' : ':param';
      return segment;
    })
    .join('/');
}

function validateFeatureIds(features: readonly PortalFeature[]): Map<string, PortalFeature> {
  const featureById = new Map<string, PortalFeature>();

  for (const feature of features) {
    validateContractId(feature.id, 'Feature ID', FEATURE_ID_PATTERN);
    if (featureById.has(feature.id)) fail(`Feature ID "${feature.id}" 重复`);
    validateFeatureLifecycle(feature);
    featureById.set(feature.id, feature);
  }

  return featureById;
}

function validateFeatureLifecycle(feature: PortalFeature): void {
  const lifecycle = feature.lifecycle;
  if (!lifecycle || lifecycle.status === 'active') return;

  if (!lifecycle.since.trim()) fail(`Feature "${feature.id}" 的 deprecated lifecycle 缺少 since`);
  if (!lifecycle.reason.trim()) fail(`Feature "${feature.id}" 的 deprecated lifecycle 缺少 reason`);
  if (!lifecycle.migrationGuide.trim()) fail(`Feature "${feature.id}" 的 deprecated lifecycle 缺少 migrationGuide`);
  if (lifecycle.replacementFeatureId) {
    validateContractId(lifecycle.replacementFeatureId, 'Replacement Feature ID', FEATURE_ID_PATTERN);
    if (lifecycle.replacementFeatureId === feature.id) fail(`Feature "${feature.id}" 的 replacementFeatureId 不能指向自身`);
  }
  if (lifecycle.removalVersion !== undefined && !lifecycle.removalVersion.trim()) {
    fail(`Feature "${feature.id}" 的 removalVersion 不能为空`);
  }
}

function validateFeatureMigrations(
  profile: PortalProfile,
  featureById: ReadonlyMap<string, PortalFeature>,
): readonly string[] {
  const migrationByFeatureId = new Map<string, NonNullable<PortalProfile['featureMigrations']>[number]>();

  for (const migration of profile.featureMigrations || []) {
    validateContractId(migration.featureId, 'Migration Feature ID', FEATURE_ID_PATTERN);
    if (migrationByFeatureId.has(migration.featureId)) fail(`Profile "${profile.id}" 重复确认 Feature "${migration.featureId}" 的迁移`);
    if (!migration.acknowledgedIn.trim()) fail(`Profile "${profile.id}" 对 Feature "${migration.featureId}" 的 acknowledgedIn 不能为空`);

    const feature = featureById.get(migration.featureId);
    if (!feature) fail(`Profile "${profile.id}" 的迁移确认指向未启用 Feature "${migration.featureId}"`);
    if (feature.lifecycle?.status !== 'deprecated') {
      fail(`Profile "${profile.id}" 对未废弃 Feature "${migration.featureId}" 保留了过期迁移确认`);
    }
    if (migration.targetFeatureId) {
      validateContractId(migration.targetFeatureId, 'Migration Target Feature ID', FEATURE_ID_PATTERN);
      if (!featureById.has(migration.targetFeatureId)) {
        fail(
          `Profile "${profile.id}" 对 Feature "${migration.featureId}" 的迁移目标 "${migration.targetFeatureId}" 未启用`,
        );
      }
      if (
        feature.lifecycle.replacementFeatureId
        && migration.targetFeatureId !== feature.lifecycle.replacementFeatureId
      ) {
        fail(
          `Profile "${profile.id}" 对 Feature "${migration.featureId}" 的迁移目标应为 "${feature.lifecycle.replacementFeatureId}"`,
        );
      }
    }
    migrationByFeatureId.set(migration.featureId, migration);
  }

  const warnings: string[] = [];
  for (const feature of featureById.values()) {
    if (feature.lifecycle?.status !== 'deprecated') continue;
    const migration = migrationByFeatureId.get(feature.id);
    if (!migration) {
      fail(
        `Profile "${profile.id}" 启用了已废弃 Feature "${feature.id}"，必须通过 featureMigrations 显式确认迁移`,
      );
    }
    warnings.push(
      `Feature "${feature.id}" 已自 ${feature.lifecycle.since} 废弃：${feature.lifecycle.reason}；迁移说明：${feature.lifecycle.migrationGuide}`,
    );
  }
  return warnings;
}

function validateDependencies(featureById: ReadonlyMap<string, PortalFeature>): void {
  for (const feature of featureById.values()) {
    const localDependencies = new Set<string>();
    for (const dependency of feature.dependsOn || []) {
      if (dependency === feature.id) fail(`Feature "${feature.id}" 不能依赖自身`);
      if (!featureById.has(dependency)) fail(`Feature "${feature.id}" 缺少依赖 "${dependency}"`);
      if (localDependencies.has(dependency)) fail(`Feature "${feature.id}" 重复声明依赖 "${dependency}"`);
      localDependencies.add(dependency);
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (featureId: string, chain: readonly string[]) => {
    if (visiting.has(featureId)) fail(`Feature 依赖存在循环：${[...chain, featureId].join(' -> ')}`);
    if (visited.has(featureId)) return;

    visiting.add(featureId);
    const feature = featureById.get(featureId);
    for (const dependency of feature?.dependsOn || []) visit(dependency, [...chain, featureId]);
    visiting.delete(featureId);
    visited.add(featureId);
  };

  for (const featureId of featureById.keys()) visit(featureId, []);
}

function validateRouteFile(route: PortalRouteDefinition, owner: string): void {
  if (!route.file || route.file.startsWith('/') || route.file.split('/').includes('..')) {
    fail(`${owner} 的路由 "${route.id}" 必须使用 app 目录内的相对文件路径`);
  }
}

function validateRoutes(ownedRoutes: readonly OwnedRoute[]): Set<string> {
  const routeIds = new Map<string, string>();
  const routePaths = new Map<string, { owner: string; routeId: string }>();
  const publicPaths = new Set<string>();

  const visit = (ownedRoute: OwnedRoute, parentPath: string, parentRouteId?: string) => {
    const { owner, route } = ownedRoute;
    validateContractId(route.id, 'Route ID');
    validateRouteFile(route, owner);

    const previousRouteOwner = routeIds.get(route.id);
    if (previousRouteOwner) fail(`Route ID "${route.id}" 在 ${previousRouteOwner} 与 ${owner} 中重复`);
    routeIds.set(route.id, owner);

    if (route.index && route.path !== undefined) fail(`${owner} 的索引路由 "${route.id}" 不能声明 path`);
    if (route.index && route.children?.length) fail(`${owner} 的索引路由 "${route.id}" 不能包含子路由`);
    if (!route.index && !route.path) fail(`${owner} 的路由 "${route.id}" 必须声明 path 或 index`);

    const fullPath = joinRoutePath(parentPath, route);
    const canonicalPath = canonicalizeRoutePath(fullPath);
    const previousPath = routePaths.get(canonicalPath);
    const isValidIndexAtParent = route.index && previousPath?.routeId === parentRouteId;
    if (previousPath && !isValidIndexAtParent) {
      fail(`路由路径 "${fullPath}" 与 ${previousPath.owner}:${previousPath.routeId} 冲突（当前：${owner}）`);
    }
    if (!isValidIndexAtParent) routePaths.set(canonicalPath, { owner, routeId: route.id });
    publicPaths.add(normalizePath(fullPath));

    for (const child of route.children || []) visit({ owner, route: child }, fullPath, route.id);
  };

  for (const route of ownedRoutes) visit(route, '');
  return publicPaths;
}

function validateNavigation(items: readonly PortalNavigationItem[], publicPaths: ReadonlySet<string>): readonly PortalNavigationItem[] {
  const keys = new Set<string>();
  const targets = new Set<string>();

  for (const item of items) {
    validateContractId(item.key, 'Navigation key');
    if (!item.label.trim()) fail(`Navigation "${item.key}" 缺少 label`);
    if (!item.to.startsWith('/') || item.to.startsWith('//')) fail(`Navigation "${item.key}" 的目标必须是 Portal 内部绝对路径`);
    if (keys.has(item.key)) fail(`Navigation key "${item.key}" 重复`);

    const target = normalizePath(item.to);
    if (targets.has(target)) fail(`Navigation 目标 "${target}" 重复`);
    if (!publicPaths.has(target)) fail(`Navigation "${item.key}" 指向未注册路由 "${target}"`);

    keys.add(item.key);
    targets.add(target);
  }

  return [...items].sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
}

function routePatternMatchesPath(pattern: string, path: string): boolean {
  const patternSegments = normalizePath(pattern).split('/').filter(Boolean);
  const pathSegments = normalizePath(path).split('/').filter(Boolean);

  if (patternSegments.at(-1) === '*') return pathSegments.length >= patternSegments.length - 1;
  if (patternSegments.length !== pathSegments.length) return false;
  return patternSegments.every((segment, index) => segment.startsWith(':') || segment === pathSegments[index]);
}

function validatePrerenderPaths(features: readonly PortalFeature[], publicPaths: ReadonlySet<string>): readonly string[] {
  const paths = new Set<string>();

  for (const feature of features) {
    for (const path of feature.prerenderPaths || []) {
      if (!path.startsWith('/') || path.startsWith('//')) fail(`Feature "${feature.id}" 的预渲染路径 "${path}" 无效`);
      const normalized = normalizePath(path);
      if (paths.has(normalized)) fail(`预渲染路径 "${normalized}" 重复`);
      if (![...publicPaths].some((routePath) => !routePath.includes('*') && routePatternMatchesPath(routePath, normalized))) {
        fail(`Feature "${feature.id}" 的预渲染路径 "${normalized}" 没有对应路由`);
      }
      paths.add(normalized);
    }
  }

  return [...paths];
}

function validateProfile(profile: PortalProfile): void {
  validateContractId(profile.id, 'Profile ID', FEATURE_ID_PATTERN);
  if (!profile.site.name.trim()) fail(`Profile "${profile.id}" 缺少站点名称`);
  if (!profile.site.shortName.trim()) fail(`Profile "${profile.id}" 缺少站点简称`);
  if (!profile.site.baseUrl.startsWith('/') || !profile.site.baseUrl.endsWith('/')) {
    fail(`Profile "${profile.id}" 的 baseUrl 必须以 / 开头和结尾`);
  }
}

export function composePortalProfile(profile: PortalProfile, options: ComposePortalProfileOptions = {}): PortalComposition {
  validateProfile(profile);
  const featureById = validateFeatureIds(profile.features);
  validateDependencies(featureById);
  const warnings = validateFeatureMigrations(profile, featureById);

  const ownedRoutes: OwnedRoute[] = [
    ...(options.kernelRoutes || []).map((route) => ({ owner: 'kernel', route })),
    ...profile.features.flatMap((feature) => feature.routes.map((route) => ({ owner: feature.id, route }))),
  ];
  const publicPaths = validateRoutes(ownedRoutes);
  const navigation = validateNavigation([...(options.kernelNavigation || []), ...profile.features.flatMap((feature) => feature.navigation || [])], publicPaths);

  return Object.freeze({
    profile,
    featureIds: Object.freeze([...featureById.keys()]),
    routes: Object.freeze(ownedRoutes.map(({ route }) => route)),
    navigation: Object.freeze(navigation),
    prerenderPaths: Object.freeze(validatePrerenderPaths(profile.features, publicPaths)),
    warnings: Object.freeze(warnings),
  });
}

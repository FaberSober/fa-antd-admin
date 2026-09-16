import type { PortalFeature } from './types';

function freezeRoute<T extends PortalFeature['routes'][number]>(route: T): T {
  return Object.freeze({
    ...route,
    children: route.children ? Object.freeze(route.children.map(freezeRoute)) : undefined,
  }) as T;
}

export function definePortalFeature<const T extends PortalFeature>(feature: T): T {
  return Object.freeze({
    ...feature,
    dependsOn: feature.dependsOn ? Object.freeze([...feature.dependsOn]) : undefined,
    routes: Object.freeze(feature.routes.map(freezeRoute)),
    navigation: feature.navigation ? Object.freeze([...feature.navigation]) : undefined,
    prerenderPaths: feature.prerenderPaths ? Object.freeze([...feature.prerenderPaths]) : undefined,
    lifecycle: feature.lifecycle ? Object.freeze({ ...feature.lifecycle }) : undefined,
  }) as T;
}

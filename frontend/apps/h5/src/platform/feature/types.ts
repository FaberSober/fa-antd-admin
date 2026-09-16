import type { ComponentType } from 'react';

export type H5FeatureId = `fa-h5-${string}-pages` | `fa-${string}-h5-pages`;
export type H5RouteId = `${H5FeatureId}.${string}`;

export interface H5LazyRouteModule {
  default: ComponentType;
}

export interface H5RouteDefinition {
  id: H5RouteId;
  path: `/${string}`;
  access: 'public' | 'authenticated';
  permission?: `/${string}`;
  title: string;
  showTabBar?: boolean;
  restoreScroll?: boolean;
  lazy: () => Promise<H5LazyRouteModule>;
}

export interface H5NavItem {
  id: string;
  routeId: H5RouteId;
  label: string;
  icon?: string;
  order?: number;
}

export interface H5HomeEntry {
  id: string;
  routeId: H5RouteId;
  title: string;
  description?: string;
  icon?: string;
  order?: number;
}

export type H5FeatureLifecycle =
  | { status: 'active' }
  | {
      status: 'deprecated';
      since: string;
      reason: string;
      migrationGuide: string;
      replacementFeatureId?: H5FeatureId;
      removalVersion?: string;
    };

export interface H5Feature {
  id: H5FeatureId;
  displayName: string;
  order?: number;
  dependsOn?: readonly H5FeatureId[];
  routes: readonly H5RouteDefinition[];
  navItems?: readonly H5NavItem[];
  homeEntries?: readonly H5HomeEntry[];
  lifecycle?: H5FeatureLifecycle;
}

export interface H5FeatureMigration {
  featureId: H5FeatureId;
  acknowledgedIn: string;
  targetFeatureId?: H5FeatureId;
}

export interface H5Project {
  id: string;
  title: string;
  basePath: '/h5';
  defaultRouteId: H5RouteId;
  features: readonly H5Feature[];
  featureMigrations?: readonly H5FeatureMigration[];
}

export interface H5Registry {
  project: H5Project;
  featureIds: readonly H5FeatureId[];
  featureMap: ReadonlyMap<H5FeatureId, H5Feature>;
  routeMap: ReadonlyMap<H5RouteId, H5RouteDefinition>;
  routes: readonly H5RouteDefinition[];
  navItems: readonly H5NavItem[];
  homeEntries: readonly H5HomeEntry[];
  lifecycleWarnings: readonly string[];
}

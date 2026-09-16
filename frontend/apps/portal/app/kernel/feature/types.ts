export interface PortalRouteDefinition {
  id: string;
  file: string;
  path?: string;
  index?: boolean;
  children?: readonly PortalRouteDefinition[];
}

export interface PortalNavigationItem {
  key: string;
  label: string;
  to: string;
  order?: number;
  end?: boolean;
}

export type PortalFeatureLifecycle =
  | {
      status: 'active';
    }
  | {
      status: 'deprecated';
      since: string;
      reason: string;
      migrationGuide: string;
      replacementFeatureId?: string;
      removalVersion?: string;
    };

export interface PortalFeature {
  id: string;
  dependsOn?: readonly string[];
  routes: readonly PortalRouteDefinition[];
  navigation?: readonly PortalNavigationItem[];
  prerenderPaths?: readonly string[];
  lifecycle?: PortalFeatureLifecycle;
}

export interface PortalSiteConfig {
  name: string;
  shortName: string;
  description: string;
  baseUrl: string;
}

export interface PortalProfile {
  id: string;
  site: PortalSiteConfig;
  features: readonly PortalFeature[];
  featureMigrations?: readonly PortalFeatureMigration[];
}

export interface PortalFeatureMigration {
  featureId: string;
  acknowledgedIn: string;
  targetFeatureId?: string;
}

export interface PortalComposition {
  profile: PortalProfile;
  featureIds: readonly string[];
  routes: readonly PortalRouteDefinition[];
  navigation: readonly PortalNavigationItem[];
  prerenderPaths: readonly string[];
  warnings: readonly string[];
}

export interface PortalRuntimeConfig {
  profileId: string;
  site: PortalSiteConfig;
  featureIds: readonly string[];
  navigation: readonly PortalNavigationItem[];
}

export interface ComposePortalProfileOptions {
  kernelRoutes?: readonly PortalRouteDefinition[];
  kernelNavigation?: readonly PortalNavigationItem[];
}

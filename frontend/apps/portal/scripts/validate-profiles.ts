import assert from 'node:assert/strict';
import adminFeature from '../app/features/fa-admin-pages/feature';
import aiFeature from '../app/features/fa-ai-pages/feature';
import { composePortalProfile, definePortalFeature, definePortalProfile, PortalFeatureConfigurationError } from '../app/kernel/feature';
import { portalKernelNavigation, portalKernelRoutes } from '../app/kernel/portalKernel';
import defaultProfile from '../app/profiles/default';
import minimalProfile from '../app/profiles/minimal';

const compose = (profile: Parameters<typeof composePortalProfile>[0]) =>
  composePortalProfile(profile, {
    kernelRoutes: portalKernelRoutes,
    kernelNavigation: portalKernelNavigation,
  });

const defaultComposition = compose(defaultProfile);
assert.deepEqual(defaultComposition.featureIds, [
  'fa-admin-pages',
  'fa-ai-pages',
]);
assert(defaultComposition.routes.some((route) => route.path === 'about'));
assert(defaultComposition.routes.some((route) => route.path === 'products'));
assert(defaultComposition.routes.some((route) => route.path === 'chat/:accessToken'));
assert(defaultComposition.navigation.some((item) => item.to === '/about'));
assert(defaultComposition.navigation.some((item) => item.to === '/contact'));
assert(defaultComposition.prerenderPaths.some((path) => path === '/products/agent-platform'));

const minimalComposition = compose(minimalProfile);
assert.deepEqual(minimalComposition.featureIds, ['fa-admin-pages']);
assert(minimalComposition.routes.some((route) => route.path === 'about'));
assert(minimalComposition.navigation.some((item) => item.to === '/about'));
assert(minimalComposition.routes.some((route) => route.path === 'login'));
assert(minimalComposition.routes.some((route) => route.path === 'products'));
assert(minimalComposition.routes.some((route) => route.path === 'contact'));
assert(!minimalComposition.routes.some((route) => route.path === 'chat/:accessToken'));

assert(aiFeature.dependsOn?.includes(adminFeature.id));
assert(adminFeature.id === 'fa-admin-pages');
assert(aiFeature.id === 'fa-ai-pages');

function expectConfigurationError(callback: () => unknown, message: string): void {
  assert.throws(callback, (error) => {
    assert(error instanceof PortalFeatureConfigurationError);
    assert.match(error.message, new RegExp(message));
    return true;
  });
}

expectConfigurationError(
  () =>
    compose(
      definePortalProfile({
        id: 'duplicate-feature',
        site: defaultProfile.site,
        features: [adminFeature, adminFeature],
      }),
    ),
  'Feature ID.*重复',
);

expectConfigurationError(
  () =>
    compose(
      definePortalProfile({
        id: 'missing-dependency',
        site: defaultProfile.site,
        features: [
          definePortalFeature({
            id: 'fa-dependent-pages',
            dependsOn: ['fa-missing-pages'],
            routes: [],
          }),
        ],
      }),
    ),
  '缺少依赖',
);

expectConfigurationError(
  () =>
    compose(
      definePortalProfile({
        id: 'route-conflict',
        site: defaultProfile.site,
        features: [
          definePortalFeature({
            id: 'fa-products-a-pages',
            routes: [
              {
                id: 'fa-products-a-pages.detail',
                path: 'products/:slug',
                file: 'features/fa-products-a-pages/pages/detail.tsx',
              },
            ],
          }),
          definePortalFeature({
            id: 'fa-products-b-pages',
            routes: [
              {
                id: 'fa-products-b-pages.detail',
                path: 'products/:id',
                file: 'features/fa-products-b-pages/pages/detail.tsx',
              },
            ],
          }),
        ],
      }),
    ),
  '路由路径.*冲突',
);

expectConfigurationError(
  () =>
    compose(
      definePortalProfile({
        id: 'navigation-conflict',
        site: defaultProfile.site,
        features: [
          adminFeature,
          definePortalFeature({
            id: 'fa-navigation-conflict-pages',
            routes: [],
            navigation: [
              {
                key: 'fa-admin-pages.home',
                label: '重复首页',
                to: '/',
              },
            ],
          }),
        ],
      }),
    ),
  'Navigation key.*重复',
);

expectConfigurationError(
  () =>
    compose(
      definePortalProfile({
        id: 'invalid-prerender',
        site: defaultProfile.site,
        features: [
          definePortalFeature({
            id: 'fa-invalid-prerender-pages',
            routes: [],
            prerenderPaths: ['/missing-page'],
          }),
        ],
      }),
    ),
  '预渲染路径.*没有对应路由',
);

const deprecatedFeature = definePortalFeature({
  id: 'fa-legacy-pages',
  routes: [],
  lifecycle: {
    status: 'deprecated',
    since: '1.2.0',
    reason: '能力已合并到新 Feature',
    replacementFeatureId: 'fa-admin-pages',
    removalVersion: '2.0.0',
    migrationGuide: 'docs/migrations/fa-legacy-pages-to-admin-pages.md',
  },
});
expectConfigurationError(
  () =>
    compose(
      definePortalProfile({
        id: 'unacknowledged-deprecation',
        site: defaultProfile.site,
        features: [adminFeature, deprecatedFeature],
      }),
    ),
  '必须通过 featureMigrations 显式确认迁移',
);
expectConfigurationError(
  () =>
    compose(
      definePortalProfile({
        id: 'missing-migration-target',
        site: defaultProfile.site,
        features: [deprecatedFeature],
        featureMigrations: [
          {
            featureId: 'fa-legacy-pages',
            acknowledgedIn: 'customer-project@1.3.0',
            targetFeatureId: 'fa-admin-pages',
          },
        ],
      }),
    ),
  '迁移目标.*未启用',
);
const deprecatedComposition = compose(
  definePortalProfile({
    id: 'acknowledged-deprecation',
    site: defaultProfile.site,
        features: [adminFeature, deprecatedFeature],
    featureMigrations: [
      {
        featureId: 'fa-legacy-pages',
        acknowledgedIn: 'customer-project@1.3.0',
        targetFeatureId: 'fa-admin-pages',
      },
    ],
  }),
);
assert.equal(deprecatedComposition.warnings.length, 1);
assert.match(deprecatedComposition.warnings[0], /fa-legacy-pages.*已自 1.2.0 废弃/);

console.log('Portal Profile validation passed: default, minimal, conflicts, lifecycle migrations');

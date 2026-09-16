import type { H5RouteDefinition } from '@/platform/feature';

export const demoRoute = {
  id: 'fa-h5-demo-pages.overview',
  path: '/app/demo',
  access: 'authenticated',
  permission: '/h5/app/demo',
  title: '装配示例',
  showTabBar: true,
  restoreScroll: true,
  lazy: () => import('./pages/overview/DemoOverviewPage'),
} satisfies H5RouteDefinition;

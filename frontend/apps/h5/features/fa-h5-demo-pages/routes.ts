import type { H5RouteDefinition } from '@/platform/feature';

export const demoRoute = {
  id: 'fa-h5-demo-pages.overview',
  path: '/app/demo',
  access: 'authenticated',
  permission: '/h5/app/demo',
  title: 'Demo',
  showTabBar: true,
  restoreScroll: true,
  lazy: () => import('./pages/overview/DemoOverviewPage'),
} satisfies H5RouteDefinition;

export const buttonDemoRoute = {
  id: 'fa-h5-demo-pages.button',
  path: '/app/demo/button',
  access: 'authenticated',
  permission: '/h5/app/demo/button',
  title: 'Button Demo',
  lazy: () => import('./pages/button/ButtonDemoPage'),
} satisfies H5RouteDefinition;

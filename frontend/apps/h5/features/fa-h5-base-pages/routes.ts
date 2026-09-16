import type { H5RouteDefinition } from '@/platform/feature';

export const homeRoute = {
  id: 'fa-h5-base-pages.home',
  path: '/app/home',
  access: 'authenticated',
  title: '工作台',
  showTabBar: true,
  restoreScroll: true,
  lazy: () => import('./pages/home/HomePage'),
} satisfies H5RouteDefinition;

export const meRoute = {
  id: 'fa-h5-base-pages.me',
  path: '/app/me',
  access: 'authenticated',
  title: '我的',
  showTabBar: true,
  restoreScroll: true,
  lazy: () => import('./pages/me/MePage'),
} satisfies H5RouteDefinition;

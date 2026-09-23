import type { H5RouteDefinition } from '@/platform/feature';

export const appDownloadRoute = {
  id: 'fa-h5-app-download-pages.download',
  path: '/app/:shortCode',
  access: 'public',
  title: 'APP 下载',
  lazy: () => import('./pages/download/AppDownloadPage'),
} satisfies H5RouteDefinition;

export const appDownloadVersionsRoute = {
  id: 'fa-h5-app-download-pages.versions',
  path: '/app/:shortCode/versions',
  access: 'public',
  title: '历史版本',
  lazy: () => import('./pages/versions/AppDownloadVersionsPage'),
} satisfies H5RouteDefinition;

import type { H5RouteDefinition } from '@/platform/feature';

export const previewRoute = {
  id: 'fa-h5-file-preview-pages.preview',
  path: '/preview',
  access: 'public',
  title: '文件预览',
  lazy: () => import('./pages/preview/PreviewPage'),
} satisfies H5RouteDefinition;

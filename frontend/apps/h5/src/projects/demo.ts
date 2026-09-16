import baseFeature from '@features/fa-h5-base-pages';
import demoFeature from '@features/fa-h5-demo-pages';
import filePreviewFeature from '@features/fa-h5-file-preview-pages';
import { defineH5Project } from '@/platform/feature';

export default defineH5Project({
  id: 'demo',
  title: 'FA H5 Demo',
  basePath: '/h5',
  defaultRouteId: 'fa-h5-base-pages.home',
  features: [baseFeature, demoFeature, filePreviewFeature],
});

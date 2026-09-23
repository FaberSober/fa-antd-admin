import appDownloadFeature from '@features/fa-h5-app-download-pages';
import baseFeature from '@features/fa-h5-base-pages';
import demoFeature from '@features/fa-h5-demo-pages';
import filePreviewFeature from '@features/fa-h5-file-preview-pages';
import { defineH5Project } from '@/platform/feature';

export default defineH5Project({
  id: 'default',
  title: 'FA H5',
  basePath: '/h5',
  defaultRouteId: 'fa-h5-base-pages.home',
  features: [baseFeature, demoFeature, filePreviewFeature, appDownloadFeature],
});

import { defineH5Feature } from '@/platform/feature';
import { appDownloadRoute, appDownloadVersionsRoute } from './routes';

const appDownloadFeature = defineH5Feature({
  id: 'fa-h5-app-download-pages',
  displayName: 'H5 APP 下载',
  order: 30,
  routes: [appDownloadRoute, appDownloadVersionsRoute],
  lifecycle: { status: 'active' },
});

export default appDownloadFeature;

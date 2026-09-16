import { defineH5Feature } from '@/platform/feature';
import { previewRoute } from './routes';

const filePreviewFeature = defineH5Feature({
  id: 'fa-h5-file-preview-pages',
  displayName: 'H5 文件预览',
  order: 20,
  routes: [previewRoute],
  lifecycle: { status: 'active' },
});

export default filePreviewFeature;

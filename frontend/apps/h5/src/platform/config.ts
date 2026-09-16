const previewDemoFileId = import.meta.env.VITE_APP_H5_PREVIEW_DEMO_FILE_ID?.trim() || null;
const previewDemoFileName = import.meta.env.VITE_APP_H5_PREVIEW_DEMO_FILE_NAME?.trim() || 'demo-file.txt';

export const h5Config = Object.freeze({
  previewDemoFileId,
  previewDemoFileName,
  previewDemoSampleUrl: '/h5/demo/file-preview/sample.txt',
});

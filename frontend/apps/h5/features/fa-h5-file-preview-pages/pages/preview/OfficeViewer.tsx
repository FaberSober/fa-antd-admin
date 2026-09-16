import officeRenderers from '@file-viewer/preset-office';
import FileViewer, { type FileViewerProps } from '@file-viewer/react';
import type { FilePreviewResource } from '../../api/filePreview';

interface OfficeViewerProps {
  resource: FilePreviewResource;
}

export default function OfficeViewer({ resource }: OfficeViewerProps) {
  const viewerProps: FileViewerProps = {
    filename: resource.filename,
    options: {
      preset: officeRenderers,
      rendererMode: 'replace',
      toolbar: {
        items: { download: false },
        permissions: { download: false },
      },
      watermark: resource.watermarkText
        ? {
            enabled: true,
            text: resource.watermarkText,
          }
        : false,
    },
    size: resource.size,
    type: resource.contentType || resource.ext || '',
    url: resource.previewUrl,
  };

  return <FileViewer {...viewerProps} />;
}

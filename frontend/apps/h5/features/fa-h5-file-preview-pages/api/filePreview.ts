import { apiClient } from '@/platform/http';

export interface FilePreviewResource {
  fileId: string;
  filename: string;
  contentType?: string;
  ext?: string;
  size?: number;
  previewUrl: string;
  downloadUrl?: string;
  downloadAllowed: boolean;
  watermarkText?: string;
}

export function exchangePreviewTicket(ticket: string): Promise<{ data: FilePreviewResource }> {
  return apiClient.post<FilePreviewResource>('/api/base/admin/fileSave/exchangePreviewTicket', { ticket }, { auth: false });
}

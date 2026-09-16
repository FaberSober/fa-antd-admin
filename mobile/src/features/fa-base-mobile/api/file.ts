import { APP_CONFIG } from '@/app.config';
import { request, uploadFile } from '../common/request';

export interface MobileFileSave {
  id: string;
  url?: string;
  size?: number;
  filename?: string;
  originalFilename?: string;
  contentType?: string;
}

export interface FilePreviewTicket {
  ticket: string;
  expiresAt: number;
}

export function uploadBaseFile(filePath: string): Promise<MobileFileSave> {
  return uploadFile<MobileFileSave>({
    url: '/base/admin/fileSave/upload',
    filePath,
    name: 'file',
  });
}

export function createFilePreviewTicket(fileId: string): Promise<FilePreviewTicket> {
  return request<FilePreviewTicket>({
    url: '/base/admin/fileSave/createPreviewTicket',
    method: 'POST',
    data: { fileId },
  });
}

export function buildH5PreviewUrl(ticket: string): string {
  const baseUrl = APP_CONFIG.h5PreviewBaseUrl.trim();
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}ticket=${encodeURIComponent(ticket)}`;
}

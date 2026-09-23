import { apiClient } from '@/platform/http';
import type { DownloadApp, DownloadAppVersion } from '../types/appDownload';

export const appDownloadApi = {
  getByShortCode(shortCode: string, signal?: AbortSignal) {
    return apiClient.post<DownloadApp>('/api/app/app/apk/getByShortCode', { shortCode }, { auth: false, signal });
  },

  listVersions(appId: number, signal?: AbortSignal) {
    return apiClient.post<DownloadAppVersion[]>('/api/app/app/apkVersion/listByAppId', { appId }, { auth: false, signal });
  },

  addDownloadNum(id: number) {
    return apiClient.post<boolean>('/api/app/app/apkVersion/addDownloadNum', { id }, { auth: false });
  },
};

export function getDownloadFileUrl(fileId: string): string {
  return `/api/base/admin/fileSave/getFile/${encodeURIComponent(fileId)}`;
}

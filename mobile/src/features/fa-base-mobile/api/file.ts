import { uploadFile } from '../common/request';

export interface MobileFileSave {
  id: string;
  url?: string;
  size?: number;
  filename?: string;
  originalFilename?: string;
  contentType?: string;
}

export function uploadBaseFile(filePath: string): Promise<MobileFileSave> {
  return uploadFile<MobileFileSave>({
    url: '/base/admin/fileSave/upload',
    filePath,
    name: 'file',
  });
}

export interface DownloadApp {
  id: number;
  name: string;
  versionCode: string;
  versionName: string;
  fileId: string;
  iconId: string;
  remark: string;
}

export interface DownloadAppVersion {
  id: number;
  appId: number;
  versionCode: string;
  versionName: string;
  fileId: string;
  crtTime: string;
  remark: string;
}

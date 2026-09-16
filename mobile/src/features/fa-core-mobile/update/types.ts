export type UpdatePlatform = 'ANDROID' | 'IOS' | 'APP_PLUS' | 'MP_WEIXIN' | 'H5';

export type UpdateType = 'NONE' | 'WGT' | 'FULL';

export interface AppVersion {
  versionName: string;
  versionCode: number;
}

export interface UpdateCheckRequest {
  appCode: string;
  platform: UpdatePlatform;
  currentVersionCode: number;
  channel?: string;
  deviceId?: string;
}

export interface UpdateManifest {
  hasUpdate: boolean;
  updateType: UpdateType;
  releaseId?: number;
  versionCode?: number;
  versionName?: string;
  baseVersionCode?: number;
  forceUpdate?: boolean;
  minSupportedVersionCode?: number;
  fileId?: string;
  downloadUrl?: string;
  size?: number;
  sha256?: string;
  releaseNote?: string;
}

export type UpdateStatus =
  | 'IDLE'
  | 'CHECKING'
  | 'AVAILABLE'
  | 'DOWNLOADING'
  | 'VERIFYING'
  | 'READY'
  | 'INSTALLING'
  | 'INSTALLED'
  | 'NO_UPDATE'
  | 'FAILED';

export interface UpdateState {
  status: UpdateStatus;
  progress: number;
  manifest?: UpdateManifest;
  filePath?: string;
  error?: string;
}

export type UpdateStateListener = (state: UpdateState) => void;

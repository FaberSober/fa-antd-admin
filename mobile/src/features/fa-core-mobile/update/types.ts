export type UpdatePlatform = 'ANDROID' | 'IOS' | 'APP_PLUS' | 'MP_WEIXIN' | 'H5';

export type UpdateType = 'NONE' | 'WGT' | 'FULL';

export interface AppVersion {
  versionName: string;
  versionCode: number;
}

export interface UpdateCheckRequest {
  appCode: string;
  platform: UpdatePlatform;
  /** 当前原生安装包版本。 */
  currentVersionCode: number;
  /** 已安装 WGT 资源版本，更新目标比较使用。 */
  currentWgtVersionCode?: number;
  channel?: string;
  deviceId?: string;
}

export interface UpdateManifest {
  hasUpdate: boolean;
  updateType: UpdateType;
  releaseId?: number | string;
  versionCode?: number;
  versionName?: string;
  forceUpdate?: boolean;
  /** WGT最低兼容APK版本；为空表示不限制。 */
  minSupportedVersionCode?: number;
  fileId?: string;
  downloadUrl?: string;
  size?: number | string;
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

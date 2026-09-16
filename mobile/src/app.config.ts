import type { TelemetryEnvironment } from './features/fa-core-mobile/telemetry/types';

let apiBaseUrl = import.meta.env.VITE_APP_API_BASE_URL || '/api';
let h5PreviewBaseUrl = import.meta.env.VITE_APP_H5_PREVIEW_BASE_URL || '/h5/preview';

// #ifdef MP-WEIXIN
apiBaseUrl = import.meta.env.VITE_APP_MP_API_BASE_URL || apiBaseUrl;
h5PreviewBaseUrl = import.meta.env.VITE_APP_MP_H5_PREVIEW_BASE_URL || h5PreviewBaseUrl;
// #endif

// #ifdef APP-PLUS
apiBaseUrl = import.meta.env.VITE_APP_APP_API_BASE_URL || apiBaseUrl;
h5PreviewBaseUrl = import.meta.env.VITE_APP_APP_H5_PREVIEW_BASE_URL || h5PreviewBaseUrl;
// #endif

const telemetryEnvironmentValue = import.meta.env.VITE_APP_TELEMETRY_ENV;
const telemetryEnvironment: TelemetryEnvironment = telemetryEnvironmentValue === 'development'
  || telemetryEnvironmentValue === 'test'
  || telemetryEnvironmentValue === 'staging'
  || telemetryEnvironmentValue === 'production'
  ? telemetryEnvironmentValue
  : import.meta.env.DEV ? 'development' : 'production';

export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'Fa Mobile',
  versionName: import.meta.env.VITE_APP_VERSION_NAME || '0.0.1',
  versionCode: import.meta.env.VITE_APP_VERSION_CODE || '1',
  apiBaseUrl,
  h5PreviewBaseUrl,
  faFrom: import.meta.env.VITE_APP_FA_FROM || 'FaApp',
  updateAppCode: import.meta.env.VITE_APP_UPDATE_APP_CODE || '',
  updateChannel: import.meta.env.VITE_APP_UPDATE_CHANNEL || 'stable',
  h5UpdateManifestUrl: import.meta.env.VITE_APP_H5_UPDATE_MANIFEST_URL || '',
  telemetryAppKey: import.meta.env.VITE_APP_TELEMETRY_APP_KEY || '',
  telemetryEnvironment,
};

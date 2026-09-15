let apiBaseUrl = import.meta.env.VITE_APP_API_BASE_URL || '/api';

// #ifdef MP-WEIXIN
apiBaseUrl = import.meta.env.VITE_APP_MP_API_BASE_URL || apiBaseUrl;
// #endif

// #ifdef APP-PLUS
apiBaseUrl = import.meta.env.VITE_APP_APP_API_BASE_URL || apiBaseUrl;
// #endif

export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'Fa Mobile',
  versionName: import.meta.env.VITE_APP_VERSION_NAME || '0.0.1',
  versionCode: import.meta.env.VITE_APP_VERSION_CODE || '1',
  apiBaseUrl,
  faFrom: import.meta.env.VITE_APP_FA_FROM || 'FaApp',
};

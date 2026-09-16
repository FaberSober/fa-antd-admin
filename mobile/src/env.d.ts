/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_BASE_URL?: string;
  readonly VITE_APP_MP_API_BASE_URL?: string;
  readonly VITE_APP_APP_API_BASE_URL?: string;
  readonly VITE_DEV_PROXY_TARGET?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_VERSION_NAME?: string;
  readonly VITE_APP_VERSION_CODE?: string;
  readonly VITE_APP_FA_FROM?: string;
  readonly VITE_APP_UPDATE_APP_CODE?: string;
  readonly VITE_APP_UPDATE_CHANNEL?: string;
  readonly VITE_APP_TELEMETRY_APP_KEY?: string;
  readonly VITE_APP_TELEMETRY_ENV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}

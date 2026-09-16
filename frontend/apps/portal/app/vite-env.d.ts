/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BASE_URL?: string;
  readonly VITE_PORTAL_API_BASE?: string;
  readonly VITE_PORTAL_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

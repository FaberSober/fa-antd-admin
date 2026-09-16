/// <reference types="vite/client" />

declare module '~react-pages' {
  import type { RouteObject } from 'react-router-dom';

  const routes: RouteObject[];
  export default routes;
}

interface ImportMetaEnv {
  readonly VITE_APP_BASE_URL?: string;
  readonly VITE_APP_PROJECT?: string;
  readonly VITE_APP_FA_VERSION_CODE?: string;
  readonly VITE_APP_FA_VERSION_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

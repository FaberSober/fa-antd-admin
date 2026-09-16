function removeTrailingSlash(value: string): string {
  return value.length > 1 ? value.replace(/\/+$/, '') : value;
}

function ensureTrailingSlash(value: string): string {
  return value.endsWith('/') ? value : `${value}/`;
}

export const portalEnv = Object.freeze({
  apiBase: removeTrailingSlash(import.meta.env.VITE_PORTAL_API_BASE || '/api'),
  baseUrl: ensureTrailingSlash(import.meta.env.BASE_URL || '/portal/'),
  siteUrl: import.meta.env.VITE_PORTAL_SITE_URL ? ensureTrailingSlash(import.meta.env.VITE_PORTAL_SITE_URL) : undefined,
});

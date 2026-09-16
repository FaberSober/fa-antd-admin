export const PORTAL_AUTH_UNAUTHORIZED_EVENT = 'portal:auth-unauthorized';
export const PORTAL_ACCESS_FORBIDDEN_EVENT = 'portal:access-forbidden';

export function emitPortalAccessEvent(status: 401 | 403): void {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new CustomEvent(status === 401 ? PORTAL_AUTH_UNAUTHORIZED_EVENT : PORTAL_ACCESS_FORBIDDEN_EVENT));
}

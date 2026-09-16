export { AuthProvider, useAuth } from './AuthContext';
export { logoutPortal, normalizePortalUser } from './api';
export {
  emitPortalAccessEvent,
  PORTAL_ACCESS_FORBIDDEN_EVENT,
  PORTAL_AUTH_UNAUTHORIZED_EVENT,
} from './events';
export { ProtectedRoute } from './ProtectedRoute';
export {
  getAccessToken,
  PORTAL_TOKEN_STORAGE_KEY,
  removeAccessToken,
  setAccessToken,
} from './storage';
export type { AuthStatus, PortalSession, PortalUser } from './types';

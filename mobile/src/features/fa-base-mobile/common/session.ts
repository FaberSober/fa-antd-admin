import type { PortalUser } from '../types/auth';

const TOKEN_KEY = 'fa.mobile.token';
const USER_KEY = 'fa.mobile.user';
const TENANT_ID_KEY_PREFIX = 'fa.mobile.tenant-id.';

function getTenantIdKey(userId: string): string {
  const normalizedUserId = userId.trim();
  return normalizedUserId ? `${TENANT_ID_KEY_PREFIX}${encodeURIComponent(normalizedUserId)}` : '';
}

export function getToken(): string | null {
  const token = uni.getStorageSync(TOKEN_KEY);
  return typeof token === 'string' && token.length > 0 ? token : null;
}

export function hasToken(): boolean {
  return Boolean(getToken());
}

export function getStoredUser(): PortalUser | null {
  const value = uni.getStorageSync(USER_KEY);
  return value && typeof value === 'object' ? (value as PortalUser) : null;
}

export function saveSession(token: string, user: PortalUser): void {
  uni.setStorageSync(TOKEN_KEY, token);
  uni.setStorageSync(USER_KEY, user);
}

export function saveUser(user: PortalUser): void {
  uni.setStorageSync(USER_KEY, user);
}

export function getStoredTenantId(userId: string): string | null {
  const key = getTenantIdKey(userId);
  if (!key) return null;

  const tenantId = uni.getStorageSync(key);
  return typeof tenantId === 'string' && tenantId.length > 0 ? tenantId : null;
}

export function saveStoredTenantId(userId: string, tenantId: string): void {
  const key = getTenantIdKey(userId);
  if (!key || !tenantId.trim()) return;
  uni.setStorageSync(key, tenantId.trim());
}

export function clearSession(): void {
  uni.removeStorageSync(TOKEN_KEY);
  uni.removeStorageSync(USER_KEY);
}

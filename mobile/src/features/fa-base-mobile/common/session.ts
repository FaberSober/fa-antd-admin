import type { PortalUser } from '../types/auth';

const TOKEN_KEY = 'fa.mobile.token';
const USER_KEY = 'fa.mobile.user';

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

export function clearSession(): void {
  uni.removeStorageSync(TOKEN_KEY);
  uni.removeStorageSync(USER_KEY);
}

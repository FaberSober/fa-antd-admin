export const PORTAL_TOKEN_STORAGE_KEY = 'Authorization';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(PORTAL_TOKEN_STORAGE_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PORTAL_TOKEN_STORAGE_KEY, token);
}

export function removeAccessToken(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(PORTAL_TOKEN_STORAGE_KEY);
}

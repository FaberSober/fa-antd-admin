const TOKEN_KEY = 'Authorization';

function getStorage(): Storage | null {
  return typeof window === 'undefined' ? null : window.localStorage;
}

export const tokenStore = {
  get(): string | null {
    return getStorage()?.getItem(TOKEN_KEY) ?? null;
  },
  set(token: string): void {
    getStorage()?.setItem(TOKEN_KEY, token);
  },
  clear(): void {
    getStorage()?.removeItem(TOKEN_KEY);
  },
};

export interface TokenStore {
  get(): string | null;
  set(token: string): void;
  clear(): void;
}

const DEFAULT_TOKEN_STORAGE_KEY = "fa.desktop.access-token";

function getLocalStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export class MemoryTokenStore implements TokenStore {
  private token: string | null = null;

  get(): string | null {
    return this.token;
  }

  set(token: string): void {
    this.token = token;
  }

  clear(): void {
    this.token = null;
  }
}

export class LocalStorageTokenStore implements TokenStore {
  constructor(private readonly key = DEFAULT_TOKEN_STORAGE_KEY) {}

  get(): string | null {
    try {
      return getLocalStorage()?.getItem(this.key) ?? null;
    } catch {
      return null;
    }
  }

  set(token: string): void {
    try {
      getLocalStorage()?.setItem(this.key, token);
    } catch {
      // localStorage 不可用时忽略持久化写入。
    }
  }

  clear(): void {
    try {
      getLocalStorage()?.removeItem(this.key);
    } catch {
      // localStorage 不可用时无需阻断退出登录流程。
    }
  }
}

export interface TokenStore {
  get(): string | null;
  set(token: string): void;
  clear(): void;
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

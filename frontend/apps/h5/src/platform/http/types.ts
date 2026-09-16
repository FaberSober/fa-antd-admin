export interface Ret<T> {
  status: number;
  code: number;
  message: string;
  data: T;
}

export interface Page<T> {
  dicts: Record<string, Array<{ label: string; value: unknown; color?: string; sort?: number }>>;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    pages: number;
    startRow: number;
    endRow: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  rows: T[];
}

export interface PageRequest {
  current?: number;
  pageSize?: number;
  query?: Record<string, unknown>;
  sorter?: string;
  [key: string]: unknown;
}

export type QueryValue = string | number | boolean | null | undefined;

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  query?: Record<string, QueryValue | readonly QueryValue[]>;
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
  timeoutMs?: number;
  auth?: boolean;
}

export interface RequestContextAdapter {
  getToken(): string | null;
  getTenantId(): string | null;
  onUnauthorized?(): void;
}

export type ApiErrorKind = 'unauthorized' | 'forbidden' | 'business' | 'http' | 'network' | 'timeout' | 'cancelled' | 'parse';

interface ApiErrorOptions {
  kind: ApiErrorKind;
  status?: number;
  code?: number;
  cause?: unknown;
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly code?: number;

  constructor(message: string, options: ApiErrorOptions) {
    super(message, { cause: options.cause });
    this.name = 'ApiError';
    this.kind = options.kind;
    this.status = options.status;
    this.code = options.code;
  }
}

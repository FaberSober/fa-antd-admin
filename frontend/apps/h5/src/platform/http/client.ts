import { tokenStore } from '@/platform/auth/token-store';
import { ApiError, type ApiErrorKind } from './errors';
import type { ApiRequestOptions, RequestContextAdapter, Ret } from './types';

const TENANT_KEY = 'fa-tn-tenant-id';
const DEFAULT_TIMEOUT_MS = 15_000;
const SUCCESS_CODE_MIN = 200;
const SUCCESS_CODE_MAX = 299;

const browserRequestContext: RequestContextAdapter = {
  getToken: () => tokenStore.get(),
  getTenantId: () => (typeof window === 'undefined' ? null : window.localStorage.getItem(TENANT_KEY)),
};

function assertApiPath(path: string): void {
  if (path !== '/api' && !path.startsWith('/api/')) {
    throw new ApiError(`API path must start with "/api": ${path}`, {
      kind: 'parse',
    });
  }
}

function appendQuery(path: string, query: ApiRequestOptions['query']): string {
  if (!query) return path;

  const search = new URLSearchParams();
  for (const [key, rawValue] of Object.entries(query)) {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];
    for (const value of values) {
      if (value !== null && value !== undefined) {
        search.append(key, String(value));
      }
    }
  }

  const suffix = search.toString();
  if (!suffix) return path;
  return `${path}${path.includes('?') ? '&' : '?'}${suffix}`;
}

function normalizeEnvelope<T>(payload: unknown, responseStatus: number): Ret<T> {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new ApiError('API response is not a valid Ret envelope', {
      kind: 'parse',
      status: responseStatus,
    });
  }

  const source = payload as Record<string, unknown>;
  const status = typeof source.status === 'number' ? source.status : responseStatus;
  const code = typeof source.code === 'number' ? source.code : status;
  const message = typeof source.message === 'string' ? source.message : '';

  return {
    status,
    code,
    message,
    data: source.data as T,
  };
}

function resolveErrorKind(status: number, code: number): ApiErrorKind {
  const normalizedCode = code >= 10_000 ? Math.trunc(code / 100) : code;
  if (status === 401 || normalizedCode === 401) return 'unauthorized';
  if (status === 403 || normalizedCode === 403) return 'forbidden';
  if (status < SUCCESS_CODE_MIN || status > SUCCESS_CODE_MAX) return 'http';
  return 'business';
}

function isSuccessCode(code: number): boolean {
  return code >= SUCCESS_CODE_MIN && code <= SUCCESS_CODE_MAX;
}

function parseJson(text: string, responseStatus: number): unknown {
  try {
    return JSON.parse(text);
  } catch (cause) {
    throw new ApiError('API response is not valid JSON', {
      kind: 'parse',
      status: responseStatus,
      cause,
    });
  }
}

export class ApiClient {
  constructor(private readonly context: RequestContextAdapter) {}

  async request<T>(path: string, options: ApiRequestOptions = {}): Promise<Ret<T>> {
    const response = await this.execute(path, options);
    const text = await response.text();
    const envelope = normalizeEnvelope<T>(parseJson(text, response.status), response.status);

    if (!response.ok || !isSuccessCode(envelope.code)) {
      const kind = resolveErrorKind(response.status, envelope.code);
      if (kind === 'unauthorized') this.context.onUnauthorized?.();
      throw new ApiError(envelope.message || `API request failed with code ${envelope.code}`, {
        kind,
        status: response.status,
        code: envelope.code,
      });
    }

    return envelope;
  }

  get<T>(path: string, options: Omit<ApiRequestOptions, 'body' | 'method'> = {}): Promise<Ret<T>> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T>(path: string, body?: unknown, options: Omit<ApiRequestOptions, 'body' | 'method'> = {}): Promise<Ret<T>> {
    return this.request<T>(path, { ...options, body, method: 'POST' });
  }

  put<T>(path: string, body?: unknown, options: Omit<ApiRequestOptions, 'body' | 'method'> = {}): Promise<Ret<T>> {
    return this.request<T>(path, { ...options, body, method: 'PUT' });
  }

  delete<T>(path: string, options: Omit<ApiRequestOptions, 'body' | 'method'> = {}): Promise<Ret<T>> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  upload<T>(path: string, formData: FormData, options: Omit<ApiRequestOptions, 'body' | 'method'> = {}): Promise<Ret<T>> {
    return this.request<T>(path, { ...options, body: formData, method: 'POST' });
  }

  async download(path: string, body?: unknown, options: Omit<ApiRequestOptions, 'body' | 'method'> = {}): Promise<Blob> {
    const response = await this.execute(path, {
      ...options,
      body,
      method: body === undefined ? 'GET' : 'POST',
    });

    if (!response.ok) {
      const text = await response.text();
      let message = `Download failed with HTTP ${response.status}`;
      let code = response.status;
      try {
        const envelope = normalizeEnvelope<unknown>(parseJson(text, response.status), response.status);
        message = envelope.message || message;
        code = envelope.code;
      } catch {
        // Keep the HTTP-level error when the body is not a Ret envelope.
      }
      const kind = resolveErrorKind(response.status, code);
      if (kind === 'unauthorized') this.context.onUnauthorized?.();
      throw new ApiError(message, {
        kind,
        status: response.status,
        code,
      });
    }

    return response.blob();
  }

  private async execute(path: string, options: ApiRequestOptions): Promise<Response> {
    assertApiPath(path);
    const controller = new AbortController();
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
    const handleExternalAbort = () => controller.abort(options.signal?.reason);
    options.signal?.addEventListener('abort', handleExternalAbort, { once: true });

    try {
      return await fetch(appendQuery(path, options.query), {
        method: options.method ?? 'GET',
        headers: this.buildHeaders(options),
        body: this.resolveBody(options.body),
        signal: controller.signal,
      });
    } catch (cause) {
      if (controller.signal.aborted) {
        throw new ApiError(timedOut ? `API request timed out after ${timeoutMs}ms` : 'API request was cancelled', {
          kind: timedOut ? 'timeout' : 'cancelled',
          cause,
        });
      }
      throw new ApiError('Unable to connect to the API', {
        kind: 'network',
        cause,
      });
    } finally {
      clearTimeout(timeout);
      options.signal?.removeEventListener('abort', handleExternalAbort);
    }
  }

  private buildHeaders(options: ApiRequestOptions): Headers {
    const headers = new Headers(options.headers);
    headers.set('Accept', 'application/json');
    headers.set('FaFrom', 'FaWeb');
    headers.set('FaVersionCode', import.meta.env.VITE_APP_FA_VERSION_CODE || '1000000');
    headers.set('FaVersionName', import.meta.env.VITE_APP_FA_VERSION_NAME || '1.0.0');

    if (options.auth !== false) {
      const token = this.context.getToken();
      if (token) headers.set('Authorization', token);
    }

    const tenantId = this.context.getTenantId();
    if (tenantId) headers.set(TENANT_KEY, tenantId);

    if (options.body !== undefined && !(options.body instanceof FormData) && !(options.body instanceof Blob)) {
      headers.set('Content-Type', 'application/json');
    }

    return headers;
  }

  private resolveBody(body: unknown): BodyInit | null {
    if (body === undefined) return null;
    if (body instanceof FormData || body instanceof Blob || typeof body === 'string' || body instanceof URLSearchParams) return body;
    return JSON.stringify(body);
  }
}

export const apiClient = new ApiClient(browserRequestContext);

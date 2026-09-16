import { emitPortalAccessEvent } from '../auth/events';
import { getAccessToken } from '../auth/storage';
import { portalEnv } from '../config';
import { PortalHttpError, PortalRequestTimeoutError } from './errors';

type QueryValue = string | number | boolean | null | undefined;

export interface PortalRequestOptions extends Omit<RequestInit, 'body' | 'signal'> {
  auth?: boolean;
  body?: BodyInit | Record<string, unknown> | unknown[] | null;
  query?: Record<string, QueryValue | QueryValue[]>;
  signal?: AbortSignal;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 15_000;

function resolveRequestUrl(endpoint: string, query?: PortalRequestOptions['query']): string {
  const isAbsolute = /^https?:\/\//i.test(endpoint);
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = isAbsolute ? endpoint : `${portalEnv.apiBase}${path}`;

  if (!query) return url;

  const search = new URLSearchParams();
  for (const [key, rawValue] of Object.entries(query)) {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];
    for (const value of values) {
      if (value !== null && value !== undefined) search.append(key, String(value));
    }
  }

  const queryString = search.toString();
  if (!queryString) return url;
  return `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
}

function isNativeBody(body: unknown): body is BodyInit {
  return (
    typeof body === 'string' ||
    body instanceof Blob ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body) ||
    body instanceof ReadableStream
  );
}

function prepareBody(body: PortalRequestOptions['body'], headers: Headers): BodyInit | null | undefined {
  if (body === undefined || body === null || isNativeBody(body)) return body;

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json;charset=UTF-8');
  }
  return JSON.stringify(body);
}

function createRequestSignal(signal: AbortSignal | undefined, timeoutMs: number) {
  const controller = new AbortController();
  let timeoutReached = false;

  const abortFromCaller = () => controller.abort(signal?.reason);
  if (signal?.aborted) abortFromCaller();
  else signal?.addEventListener('abort', abortFromCaller, { once: true });

  const timeoutId =
    timeoutMs > 0
      ? window.setTimeout(() => {
          timeoutReached = true;
          controller.abort();
        }, timeoutMs)
      : undefined;

  return {
    signal: controller.signal,
    timeoutReached: () => timeoutReached,
    cleanup: () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      signal?.removeEventListener('abort', abortFromCaller);
    },
  };
}

async function readResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return response.json();

  const text = await response.text();
  return text || undefined;
}

function getErrorMessage(status: number, body: unknown): string {
  if (typeof body === 'string') return body;
  if (body && typeof body === 'object') {
    const message = Reflect.get(body, 'message') ?? Reflect.get(body, 'msg');
    if (typeof message === 'string') return message;
  }
  return `请求失败（${status}）`;
}

export async function portalFetch(endpoint: string, options: PortalRequestOptions = {}): Promise<Response> {
  const { auth = true, body, headers: initialHeaders, query, signal: callerSignal, timeoutMs = DEFAULT_TIMEOUT_MS, ...requestInit } = options;
  const headers = new Headers(initialHeaders);
  const token = auth ? getAccessToken() : null;

  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  if (token && !headers.has('Authorization')) headers.set('Authorization', token);

  const requestSignal = createRequestSignal(callerSignal, timeoutMs);

  try {
    const response = await fetch(resolveRequestUrl(endpoint, query), {
      ...requestInit,
      body: prepareBody(body, headers),
      credentials: requestInit.credentials ?? 'same-origin',
      headers,
      signal: requestSignal.signal,
    });

    if (response.status === 401 || response.status === 403) {
      emitPortalAccessEvent(response.status);
    }

    if (!response.ok) {
      const errorBody = await readResponseBody(response);
      throw new PortalHttpError(response.status, getErrorMessage(response.status, errorBody), errorBody);
    }

    return response;
  } catch (error) {
    if (requestSignal.timeoutReached()) {
      throw new PortalRequestTimeoutError(timeoutMs);
    }
    throw error;
  } finally {
    requestSignal.cleanup();
  }
}

export async function portalRequest<T>(endpoint: string, options: PortalRequestOptions = {}): Promise<T> {
  const response = await portalFetch(endpoint, options);
  return (await readResponseBody(response)) as T;
}

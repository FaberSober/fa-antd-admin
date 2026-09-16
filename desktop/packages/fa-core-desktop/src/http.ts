import type { TokenStore } from "./session";

export interface ApiResponse<T> {
  status?: number;
  code?: number;
  message?: string;
  data: T;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestOptions {
  path: string;
  method?: HttpMethod;
  body?: unknown;
  skipAuth?: boolean;
}

export interface HttpClientOptions {
  baseUrl: string;
  headers?: Record<string, string>;
  getHeaders?: () => Record<string, string>;
  tokenStore?: TokenStore;
  onUnauthorized?: () => void;
  timeoutMs?: number;
}

export class ApiError extends Error {
  readonly statusCode?: number;
  readonly code?: number;

  constructor(message: string, statusCode?: number, code?: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
  }

  get isUnauthorized(): boolean {
    return this.statusCode === 401 || this.code === 40101;
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function readMessage(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function buildUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export class HttpClient {
  private readonly options: HttpClientOptions;

  constructor(options: HttpClientOptions) {
    this.options = options;
  }

  get<T>(path: string, options?: Omit<RequestOptions, "path" | "method">): Promise<T> {
    return this.request<T>({ ...options, path, method: "GET" });
  }

  post<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "path" | "method" | "body">): Promise<T> {
    return this.request<T>({ ...options, path, method: "POST", body });
  }

  async request<T>({ path, method = "GET", body, skipAuth = false }: RequestOptions): Promise<T> {
    const headers = new Headers({ ...this.options.headers, ...this.options.getHeaders?.() });
    headers.set("Accept", "application/json");

    const token = skipAuth ? null : this.options.tokenStore?.get();
    if (token) {
      headers.set("Authorization", token);
    }

    const hasBody = body !== undefined && body !== null;
    let requestBody: BodyInit | undefined;
    if (hasBody) {
      if (body instanceof FormData || typeof body === "string") {
        requestBody = body;
      } else {
        headers.set("Content-Type", "application/json");
        requestBody = JSON.stringify(body);
      }
    }

    const controller = new AbortController();
    const timeoutMs = this.options.timeoutMs ?? 15_000;
    const timeoutId = timeoutMs > 0 ? setTimeout(() => controller.abort(), timeoutMs) : undefined;

    let response: Response;
    try {
      response = await fetch(buildUrl(this.options.baseUrl, path), {
        method,
        headers,
        body: requestBody,
        credentials: "omit",
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiError("请求超时，请检查网络或 API 地址。");
      }
      throw new ApiError("无法连接服务器，请检查网络或 API 地址。");
    } finally {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    }

    let payload: unknown = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    const record = asRecord(payload);
    const code = readNumber(record?.code) ?? readNumber(record?.status);
    const message = readMessage(record?.message);

    if (!response.ok || (code !== undefined && code !== 200)) {
      const error = new ApiError(message ?? `请求失败（HTTP ${response.status}）。`, response.status, code);
      if (error.isUnauthorized && !skipAuth) {
        this.options.onUnauthorized?.();
      }
      throw error;
    }

    if (!record || !("data" in record)) {
      throw new ApiError(message ?? "服务器返回数据格式错误。");
    }

    return record.data as T;
  }
}

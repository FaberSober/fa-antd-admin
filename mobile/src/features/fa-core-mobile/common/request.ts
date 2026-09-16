import { APP_CONFIG } from '@/app.config';
import { telemetry } from '../telemetry';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiResponse<T> {
  status?: number;
  code?: number;
  message?: string;
  msg?: string;
  data: T;
}

export interface RequestOptions {
  url: string;
  method?: RequestMethod;
  data?: Record<string, unknown> | string | null;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  readonly statusCode?: number;
  readonly code?: number;

  constructor(message: string, statusCode?: number, code?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

function buildUrl(path: string): string {
  const baseUrl = APP_CONFIG.apiBaseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

export function request<T>({ url, method = 'GET', data, headers = {} }: RequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    const requestStartedAt = Date.now();
    const requestPath = url.split(/[?#]/, 1)[0] || '/';
    const header: Record<string, string> = {
      'Content-Type': 'application/json',
      FaFrom: APP_CONFIG.faFrom,
      FaVersionCode: APP_CONFIG.versionCode,
      FaVersionName: APP_CONFIG.versionName,
      ...telemetry.getRequestHeaders(),
      ...headers,
    };

    uni.request({
      url: buildUrl(url),
      method,
      data: data ?? undefined,
      header,
      timeout: 15000,
      success: (response) => {
        const body = (response.data || {}) as ApiResponse<T>;
        const statusCode = response.statusCode;
        const code = typeof body.code === 'number' ? body.code : statusCode;
        const message = body.message || body.msg || '请求失败';
        const duration = Date.now() - requestStartedAt;

        if (statusCode === 401 || code === 40101) {
          const apiError = new ApiError(message, statusCode, code);
          telemetry.recordHttp({ method, path: requestPath, status: statusCode, code, duration }, apiError);
          reject(apiError);
          return;
        }

        if (statusCode < 200 || statusCode >= 300 || code !== 200) {
          const apiError = new ApiError(message, statusCode, code);
          telemetry.recordHttp({ method, path: requestPath, status: statusCode, code, duration }, apiError);
          reject(apiError);
          return;
        }

        telemetry.recordHttp({ method, path: requestPath, status: statusCode, code, duration });
        resolve(body.data);
      },
      fail: (error) => {
        const apiError = new ApiError(error.errMsg || '网络请求失败');
        telemetry.recordHttp({ method, path: requestPath, status: 0, duration: Date.now() - requestStartedAt }, apiError);
        reject(apiError);
      },
    });
  });
}

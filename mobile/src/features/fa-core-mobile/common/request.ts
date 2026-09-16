import { APP_CONFIG } from '@/app.config';
import { telemetry } from '../telemetry';
import { getTenantId, TENANT_HEADER } from './tenant';

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
  skipTenant?: boolean;
}

export interface UploadOptions {
  url: string;
  filePath: string;
  name?: string;
  formData?: Record<string, string>;
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

function buildHeaders(
  headers: Record<string, string>,
  withContentType = true,
  skipTenant = false,
): Record<string, string> {
  const tenantId = getTenantId();
  return {
    ...(withContentType ? { 'Content-Type': 'application/json' } : {}),
    FaFrom: APP_CONFIG.faFrom,
    FaVersionCode: APP_CONFIG.versionCode,
    FaVersionName: APP_CONFIG.versionName,
    ...telemetry.getRequestHeaders(),
    ...headers,
    ...(!skipTenant && tenantId ? { [TENANT_HEADER]: tenantId } : {}),
  };
}

export function request<T>({ url, method = 'GET', data, headers = {}, skipTenant = false }: RequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    const requestStartedAt = Date.now();
    const requestPath = url.split(/[?#]/, 1)[0] || '/';
    const header = buildHeaders(headers, true, skipTenant);

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

export function uploadFile<T>({
  url,
  filePath,
  name = 'file',
  formData,
  headers = {},
}: UploadOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    const uploadStartedAt = Date.now();
    const uploadPath = url.split(/[?#]/, 1)[0] || '/';
    const header = buildHeaders(headers, false);

    uni.uploadFile({
      url: buildUrl(url),
      filePath,
      name,
      formData,
      header,
      success: (response) => {
        const statusCode = response.statusCode;
        const duration = Date.now() - uploadStartedAt;
        let body: ApiResponse<T>;

        try {
          body = (JSON.parse(response.data || '{}') || {}) as ApiResponse<T>;
        } catch {
          const apiError = new ApiError('文件上传响应格式错误', statusCode);
          telemetry.recordHttp({ method: 'POST', path: uploadPath, status: statusCode, duration }, apiError);
          reject(apiError);
          return;
        }

        const code = typeof body.code === 'number' ? body.code : statusCode;
        const message = body.message || body.msg || '文件上传失败';

        if (statusCode === 401 || code === 40101 || statusCode < 200 || statusCode >= 300 || code !== 200) {
          const apiError = new ApiError(message, statusCode, code);
          telemetry.recordHttp({ method: 'POST', path: uploadPath, status: statusCode, code, duration }, apiError);
          reject(apiError);
          return;
        }

        telemetry.recordHttp({ method: 'POST', path: uploadPath, status: statusCode, code, duration });
        resolve(body.data);
      },
      fail: (error) => {
        const apiError = new ApiError(error.errMsg || '文件上传失败');
        telemetry.recordHttp({ method: 'POST', path: uploadPath, status: 0, duration: Date.now() - uploadStartedAt }, apiError);
        reject(apiError);
      },
    });
  });
}

import { APP_CONFIG } from '@/app.config';
import { clearSession, getToken } from './session';

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
  skipAuth?: boolean;
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

let redirectingToLogin = false;

function buildUrl(path: string): string {
  const baseUrl = APP_CONFIG.apiBaseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

function handleUnauthorized(): void {
  clearSession();
  if (redirectingToLogin) return;

  redirectingToLogin = true;
  uni.showToast({ title: '登录已失效，请重新登录', icon: 'none' });
  setTimeout(() => {
    uni.reLaunch({
      url: '/features/fa-base-mobile/pages/login/index',
      complete: () => {
        redirectingToLogin = false;
      },
    });
  }, 300);
}

export function request<T>({ url, method = 'GET', data, skipAuth = false }: RequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    const token = getToken();
    const header: Record<string, string> = {
      'Content-Type': 'application/json',
      FaFrom: APP_CONFIG.faFrom,
      FaVersionCode: APP_CONFIG.versionCode,
      FaVersionName: APP_CONFIG.versionName,
    };

    if (token && !skipAuth) {
      header.Authorization = token;
    }

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

        if (statusCode === 401 || code === 40101) {
          if (!skipAuth) handleUnauthorized();
          reject(new ApiError(message, statusCode, code));
          return;
        }

        if (statusCode < 200 || statusCode >= 300 || code !== 200) {
          reject(new ApiError(message, statusCode, code));
          return;
        }

        resolve(body.data);
      },
      fail: (error) => {
        reject(new ApiError(error.errMsg || '网络请求失败'));
      },
    });
  });
}

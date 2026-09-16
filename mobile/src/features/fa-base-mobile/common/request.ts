import {
  ApiError,
  request as coreRequest,
} from '@features/fa-core-mobile/common/request';
import type {
  ApiResponse,
  RequestOptions as CoreRequestOptions,
} from '@features/fa-core-mobile/common/request';
import { telemetry } from '@features/fa-core-mobile/telemetry';
import { clearSession, getToken } from './session';

export { ApiError };
export type { ApiResponse };

export interface RequestOptions extends Omit<CoreRequestOptions, 'headers'> {
  skipAuth?: boolean;
}

let redirectingToLogin = false;

function handleUnauthorized(): void {
  clearSession();
  telemetry.clearUser();
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

export function request<T>({ skipAuth = false, ...options }: RequestOptions): Promise<T> {
  const token = getToken();
  const headers = token && !skipAuth ? { Authorization: token } : undefined;

  return coreRequest<T>({
    ...options,
    ...(headers ? { headers } : {}),
  }).catch((error) => {
    if (
      !skipAuth
      && error instanceof ApiError
      && (error.statusCode === 401 || error.code === 40101)
    ) {
      handleUnauthorized();
    }
    throw error;
  });
}

import { request } from '../common/request';
import type { PortalSession, PortalUser } from '../types/auth';

export function login(username: string, password: string): Promise<PortalSession> {
  return request<PortalSession>({
    url: '/portal/auth/login',
    method: 'POST',
    data: { username, password },
    skipAuth: true,
  });
}

export function getCurrentUser(): Promise<PortalUser> {
  return request<PortalUser>({
    url: '/portal/account/me',
    method: 'GET',
  });
}

export function logout(): Promise<void> {
  return request<void>({
    url: '/portal/auth/logout',
    method: 'GET',
  });
}

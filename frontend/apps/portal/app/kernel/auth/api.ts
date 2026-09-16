import { portalRequest } from '../http';
import type { PortalUser } from './types';

interface ApiEnvelope<T> {
  data?: T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function normalizePortalUser(payload: PortalUser | ApiEnvelope<PortalUser>): PortalUser {
  const candidate = isRecord(payload) && isRecord(payload.data) ? payload.data : payload;

  if (!isRecord(candidate) || candidate.id === undefined) {
    throw new Error('Portal 当前用户接口返回格式无效');
  }

  return {
    id: String(candidate.id),
    username: String(candidate.username ?? ''),
    name: String(candidate.name ?? candidate.username ?? ''),
    avatar: typeof candidate.avatar === 'string' ? candidate.avatar : null,
    tel: typeof candidate.tel === 'string' ? candidate.tel : null,
    email: typeof candidate.email === 'string' ? candidate.email : null,
    status: candidate.status === undefined ? true : Boolean(candidate.status),
    adminEnabled: Boolean(candidate.adminEnabled),
  };
}

export async function fetchCurrentPortalUser(signal?: AbortSignal): Promise<PortalUser> {
  const payload = await portalRequest<PortalUser | ApiEnvelope<PortalUser>>('/portal/account/me', { signal });
  return normalizePortalUser(payload);
}

export async function logoutPortal(): Promise<void> {
  await portalRequest('/portal/auth/logout');
}

import { normalizePortalUser, type PortalSession } from '../../../kernel/auth';
import { portalRequest } from '../../../kernel/http';

interface ApiEnvelope<T> {
  data?: T;
}

interface SessionPayload {
  token?: unknown;
  user?: unknown;
}

function unwrap<T>(payload: T | ApiEnvelope<T>): T {
  return payload && typeof payload === 'object' && 'data' in payload && payload.data !== undefined ? payload.data : (payload as T);
}

function normalizeSession(payload: SessionPayload | ApiEnvelope<SessionPayload>): PortalSession {
  const value = unwrap(payload);
  if (!value || typeof value !== 'object' || typeof value.token !== 'string' || !value.token) {
    throw new Error('登录接口返回格式无效');
  }
  return {
    token: value.token,
    user: normalizePortalUser(value.user as never),
  };
}

export async function loginPortal(username: string, password: string): Promise<PortalSession> {
  const payload = await portalRequest<SessionPayload | ApiEnvelope<SessionPayload>>('/portal/auth/login', {
    auth: false,
    method: 'POST',
    body: { username, password },
  });
  return normalizeSession(payload);
}

export interface RegisterPortalInput {
  username: string;
  name: string;
  tel: string;
  password: string;
  passwordConfirm: string;
}

export async function registerPortal(input: RegisterPortalInput): Promise<PortalSession> {
  const payload = await portalRequest<SessionPayload | ApiEnvelope<SessionPayload>>('/portal/auth/register', {
    auth: false,
    method: 'POST',
    body: { ...input },
  });
  return normalizeSession(payload);
}

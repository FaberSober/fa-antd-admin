export interface PortalUser {
  id: string;
  username: string;
  name: string;
  avatar?: string | null;
  tel?: string | null;
  email?: string | null;
  status?: boolean;
  adminEnabled?: boolean;
}

export type AuthStatus = 'loading' | 'anonymous' | 'authenticated' | 'error';

export interface PortalSession {
  token: string;
  user: PortalUser;
}

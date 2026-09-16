import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PortalHttpError } from '../http';
import { fetchCurrentPortalUser } from './api';
import { PORTAL_AUTH_UNAUTHORIZED_EVENT } from './events';
import { getAccessToken, removeAccessToken, setAccessToken } from './storage';
import type { AuthStatus, PortalSession, PortalUser } from './types';

interface AuthContextValue {
  status: AuthStatus;
  user: PortalUser | null;
  error: Error | null;
  refresh: () => Promise<void>;
  setSession: (session: PortalSession) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<PortalUser | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const signOut = useCallback(() => {
    removeAccessToken();
    setUser(null);
    setError(null);
    setStatus('anonymous');
  }, []);

  const refresh = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      setError(null);
      setStatus('anonymous');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const currentUser = await fetchCurrentPortalUser();
      setUser(currentUser);
      setStatus('authenticated');
    } catch (requestError) {
      if (requestError instanceof PortalHttpError && requestError.status === 401) {
        signOut();
        return;
      }

      setUser(null);
      setError(requestError instanceof Error ? requestError : new Error('恢复登录状态失败'));
      setStatus('error');
    }
  }, [signOut]);

  const setSession = useCallback((session: PortalSession) => {
    setAccessToken(session.token);
    setUser(session.user);
    setError(null);
    setStatus('authenticated');
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    window.addEventListener(PORTAL_AUTH_UNAUTHORIZED_EVENT, signOut);
    return () => window.removeEventListener(PORTAL_AUTH_UNAUTHORIZED_EVENT, signOut);
  }, [signOut]);

  const value = useMemo<AuthContextValue>(() => ({ status, user, error, refresh, setSession, signOut }), [error, refresh, setSession, signOut, status, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth 必须在 AuthProvider 内使用');
  return context;
}

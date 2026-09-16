import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { PortalLoading } from '../../shared/ui/PortalLoading';
import { SessionUnavailable } from '../../shared/ui/SessionUnavailable';
import { useAuth } from './AuthContext';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.status === 'loading') {
    return <PortalLoading label="正在恢复登录状态" />;
  }

  if (auth.status === 'error') {
    return <SessionUnavailable error={auth.error} onRetry={auth.refresh} />;
  }

  if (auth.status !== 'authenticated') {
    const redirect = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate replace to={`/login?redirect=${encodeURIComponent(redirect)}`} />;
  }

  return children;
}

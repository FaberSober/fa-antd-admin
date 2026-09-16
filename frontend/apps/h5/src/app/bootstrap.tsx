import { Suspense } from 'react';
import { BrowserRouter, useLocation, useRoutes } from 'react-router-dom';
import { AppErrorBoundary } from '@/app/error-boundary';
import { AppProviders } from '@/app/providers';
import { AppShell } from '@/layouts/AppShell';
import { PageLoading } from '@/shared/components/PageLoading';
import routes from '~react-pages';

function H5Routes() {
  const location = useLocation();
  const content = useRoutes(routes);
  const isAppRoute = location.pathname === '/app' || location.pathname.startsWith('/app/');

  return isAppRoute ? <AppShell>{content}</AppShell> : content;
}

export function H5Bootstrap() {
  return (
    <AppErrorBoundary>
      <AppProviders>
        <BrowserRouter basename="/h5">
          <Suspense fallback={<PageLoading />}>
            <H5Routes />
          </Suspense>
        </BrowserRouter>
      </AppProviders>
    </AppErrorBoundary>
  );
}

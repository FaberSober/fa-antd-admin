import { Suspense } from 'react';
import { BrowserRouter, useLocation, useRoutes } from 'react-router-dom';
import { AppErrorBoundary } from '@/app/error-boundary';
import { AppProviders } from '@/app/providers';
import { AppShell } from '@/layouts/AppShell';
import { PageLoading } from '@/shared/components/PageLoading';
import routes from '~react-pages';

const workspaceRoutes = new Set(['/app/home', '/app/me', '/app/demo']);

function H5Routes() {
  const location = useLocation();
  const content = useRoutes(routes);
  const routePath = location.pathname.replace(/\/+$/, '') || '/';
  const isAppRoute = routePath === '/app' || routePath.startsWith('/app/');
  const isVersionRoute = /^\/app\/[^/]+\/versions$/.test(routePath);
  const isShortCodeRoute = /^\/app\/[^/]+$/.test(routePath);
  const isAppDownloadRoute = isVersionRoute || (isShortCodeRoute && !workspaceRoutes.has(routePath));

  return isAppRoute && !isAppDownloadRoute ? <AppShell>{content}</AppShell> : content;
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

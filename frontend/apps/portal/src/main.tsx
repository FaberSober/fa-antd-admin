import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { AuthProvider } from '../app/kernel/auth';
import { PortalLayout } from '../app/kernel/layouts/PortalLayout';
import { PortalLoading } from '../app/shared/ui/PortalLoading';
import { portalRuntime } from '../.portal/runtime-profile';
import routes from '~react-pages';
import '../app/styles/global.css';

document.title = portalRuntime.site.name;

function PortalRoutes() {
  return useRoutes(routes);
}

function App() {
  return (
    <AuthProvider>
      <PortalLayout>
        <Suspense fallback={<PortalLoading label="正在加载页面" />}>
          <PortalRoutes />
        </Suspense>
      </PortalLayout>
    </AuthProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename="/portal/">
    <App />
  </BrowserRouter>,
);

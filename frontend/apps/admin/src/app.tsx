/* eslint-disable react-refresh/only-export-components */
import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import 'virtual:uno.css';

import '@fa/theme/theme.scss';
import './globals.scss';

import { PageLoading } from '@fa/ui';
import { TelemetryPageTracker, TelemetryProvider } from '@features/fa-admin-pages/telemetry';
import routes from '~react-pages';

window.FaRoutes = routes;

const VITE_APP_AMAP_KEY_SECRET = import.meta.env.VITE_APP_AMAP_KEY_SECRET;
window._AMapSecurityConfig = {
  securityJsCode: VITE_APP_AMAP_KEY_SECRET,
};

function App() {
  return <Suspense fallback={<PageLoading />}>{useRoutes(routes)}</Suspense>;
}

const app = createRoot(document.getElementById('root')!);

app.render(
  <TelemetryProvider>
    <Router>
      <HelmetProvider>
        <TelemetryPageTracker>
          <App />
        </TelemetryPageTracker>
      </HelmetProvider>
    </Router>
  </TelemetryProvider>,
);

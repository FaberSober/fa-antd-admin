/* eslint-disable react-refresh/only-export-components */
import { Suspense, useEffect } from 'react';
// import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, useLocation, useRoutes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// import { AliveScope } from 'react-activation'
import 'virtual:uno.css';

// import '@fa/ui/index.css';
import '@fa/theme/theme.scss';
import './globals.scss';

import routes from '~react-pages';
import { PageLoading } from '@fa/ui';

import FallbackComponent from '@features/fa-admin-pages/components/exception/FallbackComponent';
import { telemetry, TelemetryErrorBoundary, type TelemetryEnvironment } from '@features/fa-admin-pages/telemetry';

const telemetryEnvironment = import.meta.env.VITE_APP_TELEMETRY_ENV;
const environment: TelemetryEnvironment = ['development', 'test', 'staging', 'production'].includes(telemetryEnvironment)
  ? telemetryEnvironment as TelemetryEnvironment
  : import.meta.env.DEV ? 'development' : 'production';

if (import.meta.env.VITE_APP_TELEMETRY_APP_KEY) {
  telemetry.init({
    appKey: import.meta.env.VITE_APP_TELEMETRY_APP_KEY,
    clientType: 'WEB',
    environment,
    release: String(window.FaVersionName || 'unknown'),
  });
  const telemetryWindow = window as Window & { faHeader?: Record<string, string> };
  telemetryWindow.faHeader = { ...telemetryWindow.faHeader, ...telemetry.getRequestHeaders() };
}

window.FaRoutes = routes;

const VITE_APP_AMAP_KEY_SECRET = import.meta.env.VITE_APP_AMAP_KEY_SECRET;
window._AMapSecurityConfig = {
  securityJsCode: VITE_APP_AMAP_KEY_SECRET,
};

function App() {
  const location = useLocation();
  useEffect(() => {
    telemetry.page();
  }, [location.pathname, location.search]);
  return <Suspense fallback={<PageLoading />}>{useRoutes(routes)}</Suspense>;
}

const app = createRoot(document.getElementById('root')!);

app.render(
  <TelemetryErrorBoundary fallback={<FallbackComponent />}>
    <Router>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Router>
  </TelemetryErrorBoundary>,
);

// 使用AliveScope，github建议使用ReactDOM.render
// ReactDOM.render(
//   <AliveScope>
//     <Router>
//       <HelmetProvider>
//         <App />
//       </HelmetProvider>
//     </Router>
//   </AliveScope>,
//   document.getElementById('root')
// )

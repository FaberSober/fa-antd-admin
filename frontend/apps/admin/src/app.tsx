/* eslint-disable react-refresh/only-export-components */
import { Suspense } from 'react';
// import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// import { AliveScope } from 'react-activation'
import 'virtual:uno.css';

import '@fa/ui/index.css';
import '@fa/ui/styles.css';
import '@fa/theme/theme.scss';
import './globals.scss';

import routes from '~react-pages';
import { PageLoading } from '@fa/ui';

// -------------------- 异常捕捉 --------------------
import * as Sentry from "@sentry/react";
import FallbackComponent from '@features/fa-admin-pages/components/exception/FallbackComponent';

Sentry.init({
  dsn: "xxx",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});
// -------------------- 异常捕捉 --------------------

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
  <Sentry.ErrorBoundary fallback={<FallbackComponent />}>
    <Router>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Router>
  </Sentry.ErrorBoundary>,
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

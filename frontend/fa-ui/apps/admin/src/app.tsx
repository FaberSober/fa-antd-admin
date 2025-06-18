/* eslint-disable react-refresh/only-export-components */
import { Suspense } from 'react';
// import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// import { AliveScope } from 'react-activation'

import '@fa/ui/index.css';
import '@fa/ui/styles.css';
import '@fa/theme/theme.scss';
import './globals.scss';

import routes from '~react-pages';
import { PageLoading } from '@fa/ui';

// console.log(routes);

// ָ���汾��Ϣ
window.FaFrom = import.meta.env.VITE_APP_FA_FROM;
window.FaVersionCode = import.meta.env.VITE_APP_FA_VERSION_CODE;
window.FaVersionName = import.meta.env.VITE_APP_FA_VERSION_NAME;

window.FaRoutes = routes;


function App() {
  return <Suspense fallback={<PageLoading />}>{useRoutes(routes)}</Suspense>;
}

const app = createRoot(document.getElementById('root')!);

app.render(
  <Router>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </Router>,
);

// ʹ��AliveScope��github����ʹ��ReactDOM.render
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

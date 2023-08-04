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

// 指定版本信息
window.FaFrom = import.meta.env.VITE_APP_FA_FROM;
window.FaVersionCode = import.meta.env.VITE_APP_FA_VERSION_CODE;
window.FaVersionName = import.meta.env.VITE_APP_FA_VERSION_NAME;


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

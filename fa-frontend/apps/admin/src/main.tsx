import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { ConfigProvider } from 'antd';

// 国际化
import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
// import enUS from 'antd/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';

import './styles/globals.scss';
import '@fa/theme/theme.scss';
import '@fa/ui/styles.css';

import routes from '~react-pages';

// eslint-disable-next-line no-console
console.log(routes);

function App() {
  return <Suspense fallback={<p>Loading...</p>}>{useRoutes(routes)}</Suspense>;
}

const app = createRoot(document.getElementById('app')!);

app.render(
  <Router>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </Router>,
);

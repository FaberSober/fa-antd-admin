import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';

import './index.less';

import routes from '~react-pages';
import { PageLoading } from '@/components/antd-pro';

// fontawesome icon
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

// eslint-disable-next-line no-console
// console.log(routes)

const tag: Demo.StudentTag = { name: 'foo' };
console.log('Admin', 'Demo.Student', tag);

const tag1 = { name: 'foo' } as Admin.ConfigScene;
console.log('Admin', 'Admin.ConfigScene', tag1);

function App() {
  return <Suspense fallback={<PageLoading />}>{useRoutes(routes)}</Suspense>;
}

const app = createRoot(document.getElementById('app')!);

app.render(
  <Router>
    <App />
  </Router>,
);

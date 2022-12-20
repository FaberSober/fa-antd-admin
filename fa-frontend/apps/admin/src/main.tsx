import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';

import './globals.scss';
import '@fa/theme/theme.scss';
import '@fa/ui/index.css';
import '@fa/ui/styles.css';

import routes from '~react-pages';
import { PageLoading } from '@fa/ui';

// console.log(routes);

function App() {
  return <Suspense fallback={<PageLoading />}>{useRoutes(routes)}</Suspense>;
}

const app = createRoot(document.getElementById('app')!);

app.render(
  <Router>
    <App />
  </Router>,
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { H5Bootstrap } from '@/app/bootstrap';
import '@/styles/tokens.css';
import '@/styles/global.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('H5 root element "#root" is missing');
}

createRoot(rootElement).render(
  <StrictMode>
    <H5Bootstrap />
  </StrictMode>,
);

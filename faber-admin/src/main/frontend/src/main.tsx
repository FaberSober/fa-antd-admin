import React,{ StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import Router from './router/router';

import './index.less'


// 新的 createRoot API
const container = document.getElementById('root');
// @ts-ignore
const root = createRoot(container);
root.render(
  <StrictMode>
    <Router />
  </StrictMode>
);

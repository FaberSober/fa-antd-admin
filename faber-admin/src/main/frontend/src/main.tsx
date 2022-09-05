import React from 'react';
import ReactDom from 'react-dom';
// import { createRoot } from 'react-dom/client';
import Router from './router/router';

import './index.less'

ReactDom.render(<Router />, document.getElementById('root'));

// FIXME: 使用React18新的 createRoot API，会导致页面卡死，目前还未找到问题
// @ts-ignore
// const root = createRoot(document.getElementById('root'));
// root.render(<Router />);

import React from 'react';
import MenuContainer from '@features/fa-admin-pages/layout/menu/MenuContainer';
import { APILoader } from '@uiw/react-amap';

const VITE_APP_AMAP_KEY = import.meta.env.VITE_APP_AMAP_KEY;

/**
 * 使用admin的公共长字形布局。这里还可以修改为：用户选择不同的布局，在这里返回不同的布局。
 */
export default function admin() {
  return (
    // @ts-ignore
    <APILoader version="2.0.5" akey={VITE_APP_AMAP_KEY}>
      <MenuContainer />
    </APILoader>
  );
}

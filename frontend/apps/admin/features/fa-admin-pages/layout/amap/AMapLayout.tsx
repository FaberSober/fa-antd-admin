import React, { useContext } from 'react';
import type { Fa } from '@fa/ui';
import { APILoader } from '@uiw/react-amap';
import { ConfigLayoutContext } from '../config/context/ConfigLayoutContext';

const VITE_APP_AMAP_KEY = import.meta.env.VITE_APP_AMAP_KEY;

/**
 * @author xu.pengfei
 * @date 2023/8/26 12:08
 */
export default function AMapLayout({ children }: Fa.BaseChildProps) {
  const { systemConfig } = useContext(ConfigLayoutContext);

  if (systemConfig.offline) {
    console.error('offline mode 离线模式不加载高德地图API，无法使用高德地图，请注意。');
    return children;
  }

  console.log('online mode 在线模式加载高德地图API');
  return (
    <APILoader version="2.0" akey={VITE_APP_AMAP_KEY}>
      {children}
    </APILoader>
  );
}

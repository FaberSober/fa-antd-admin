import React, { useContext, useEffect } from 'react';
import type { Fa } from '@fa/ui';
import { ConfigLayoutContext } from '../config/context/ConfigLayoutContext';

const VITE_APP_AMAP_KEY = import.meta.env.VITE_APP_AMAP_KEY;
const AMAP_SCRIPT_ID = 'fa-amap-jsapi';
const AMAP_LOAD_TIMEOUT = 10_000;

let amapLoading = false;

function loadAMap() {
  if (window.AMap || amapLoading) {
    return;
  }

  if (!VITE_APP_AMAP_KEY) {
    console.warn('高德地图API Key为空，跳过高德地图API加载。');
    return;
  }

  amapLoading = true;
  const callbackName = `__faAMapLoaded_${Date.now()}`;
  const script = document.createElement('script');
  const timer = window.setTimeout(() => {
    amapLoading = false;
    console.warn('高德地图API加载超时，已降级为不阻塞页面加载。');
  }, AMAP_LOAD_TIMEOUT);

  (window as any)[callbackName] = (err?: unknown) => {
    window.clearTimeout(timer);
    amapLoading = false;
    delete (window as any)[callbackName];

    if (err) {
      console.warn('高德地图API加载失败，已降级为不阻塞页面加载。', err);
      return;
    }
    console.log('高德地图API加载完成。');
  };

  script.id = AMAP_SCRIPT_ID;
  script.type = 'text/javascript';
  script.async = true;
  script.src = `https://webapi.amap.com/maps?callback=${callbackName}&v=2.0&key=${VITE_APP_AMAP_KEY}`;
  script.onerror = (err) => {
    window.clearTimeout(timer);
    amapLoading = false;
    delete (window as any)[callbackName];
    console.warn('高德地图API加载失败，已降级为不阻塞页面加载。', err);
  };

  document.body.appendChild(script);
}

/**
 * @author xu.pengfei
 * @date 2023/8/26 12:08
 */
export default function AMapLayout({ children }: Fa.BaseChildProps) {
  const { systemConfig } = useContext(ConfigLayoutContext);

  useEffect(() => {
    if (systemConfig.offline) {
      console.warn('offline mode 离线模式不加载高德地图API，无法使用高德地图，请注意。');
      return;
    }

    if (document.getElementById(AMAP_SCRIPT_ID)) {
      return;
    }

    console.log('online mode 在线模式加载高德地图API');
    loadAMap();
  }, [systemConfig.offline]);

  return children;
}

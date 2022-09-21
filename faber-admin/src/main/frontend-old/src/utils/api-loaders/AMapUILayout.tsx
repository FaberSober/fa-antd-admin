import React, { createContext, ReactNode, useEffect, useState } from 'react';
import AMapUILoader from '@/utils/api-loaders/AMapUILoader';

export interface AMapUILayoutContextProps {
  loaded: boolean;
}

export const AMapUILayoutContext = createContext<AMapUILayoutContextProps>({ loaded: false });

export interface AMapUILayoutProps {
  children?: ReactNode | Element;
}

/**
 * 高德地图-AMapUI 组件库
 * @author xu.pengfei
 * @date 2021/1/21
 */
export default function AMapUILayout({ children }: AMapUILayoutProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    new AMapUILoader().load().then(() => {
      setLoaded(true);
    });
  }, []);

  return (
    <AMapUILayoutContext.Provider value={{ loaded }}>
      <>{children}</>
    </AMapUILayoutContext.Provider>
  );
}

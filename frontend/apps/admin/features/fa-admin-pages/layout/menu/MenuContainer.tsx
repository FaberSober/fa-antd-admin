import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ApiEffectLayout, PageLoading, ThemeLayout } from '@fa/ui';
import { SITE_INFO } from '@/configs';
import LangLayout from '../lang/LangLayout';
import ConfigLayout from '../config/ConfigLayout';
import UserLayout from '../user/UserLayout';
import MenuLayout from './MenuLayout';
import AMapLayout from '../amap/AMapLayout';
import WebSocketLayout from '../websocket/WebSocketLayout';

export default function MenuContainer() {
  return (
    <ThemeLayout colorPrimary={SITE_INFO.PRIMARY_COLOR} initThemeDark={SITE_INFO.THEME === 'dark'}>
      <LangLayout>
        <ApiEffectLayout>
          <ConfigLayout>
            <UserLayout>
              <WebSocketLayout>
                <AMapLayout>
                  <MenuLayout>
                    <Suspense fallback={<PageLoading />}>
                      <Outlet />
                    </Suspense>
                  </MenuLayout>
                </AMapLayout>
              </WebSocketLayout>
            </UserLayout>
          </ConfigLayout>
        </ApiEffectLayout>
      </LangLayout>
    </ThemeLayout>
  );
}

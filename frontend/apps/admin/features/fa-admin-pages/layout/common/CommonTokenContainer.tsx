import React, { Suspense } from 'react';
import { ApiEffectLayout, PageLoading, ThemeLayout } from '@fa/ui';
import { SITE_INFO } from '@/configs';
import LangLayout from '../lang/LangLayout';
import { Outlet } from 'react-router-dom';
import { ConfigLayout, UserTokenLayout } from '@features/fa-admin-pages/layout';
import { WebSocketLayout } from '@features/fa-admin-pages/layout/websocket';

/**
 * 通用的包裹组件，基本上所有的页面都需要这些容器包裹
 * @author xu.pengfei
 * @date 2023/12/04 10:48
 */
export default function CommonUserContainer() {
  return (
    <ThemeLayout colorPrimary={SITE_INFO.PRIMARY_COLOR}>
      <LangLayout>
        <ApiEffectLayout>
          <ConfigLayout>
            <UserTokenLayout>
              <WebSocketLayout>
                <Suspense fallback={<PageLoading />}>
                  <Outlet />
                </Suspense>
              </WebSocketLayout>
            </UserTokenLayout>
          </ConfigLayout>
        </ApiEffectLayout>
      </LangLayout>
    </ThemeLayout>
  );
}

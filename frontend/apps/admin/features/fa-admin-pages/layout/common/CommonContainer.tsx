import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ApiEffectLayout, PageLoading, ThemeLayout } from '@fa/ui';
import { SITE_INFO } from '@/configs';
import LangLayout from '../lang/LangLayout';
import ConfigLayout from '../config/ConfigLayout';

/**
 * 通用的包裹组件，基本上所有的页面都需要这些容器包裹
 * @author xu.pengfei
 * @date 2023/7/1 13:48
 */
export default function CommonContainer() {
  return (
    <ThemeLayout colorPrimary={SITE_INFO.PRIMARY_COLOR}>
      <LangLayout>
        <ApiEffectLayout>
          <ConfigLayout>
            <Suspense fallback={<PageLoading />}>
              <Outlet />
            </Suspense>
          </ConfigLayout>
        </ApiEffectLayout>
      </LangLayout>
    </ThemeLayout>
  );
}

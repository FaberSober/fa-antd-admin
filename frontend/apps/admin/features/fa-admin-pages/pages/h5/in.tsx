import React, { Suspense } from 'react';
import { PageLoading, setToken, useQs } from '@fa/ui';
import { Outlet } from 'react-router-dom';
import UserLayout from '../../layout/user/UserLayout';

/**
 * h5 登录后的用户界面
 * @author xu.pengfei
 * @date 2023/9/5 19:33
 */
export default function H5() {
  const search: any = useQs();

  setToken(search.token);

  return (
    <UserLayout>
      <Suspense fallback={<PageLoading />}>
        <Outlet />
      </Suspense>
    </UserLayout>
  );
}

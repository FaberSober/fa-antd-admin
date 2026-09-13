import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, PageLoading } from '@fa/ui';
import { userApi } from '@/services';
import { SITE_INFO } from '@/configs';

export default function AppPages() {
  const navigate = useNavigate();

  useEffect(() => {
    // 无本地 token 时直接进登录页，避免发起必然失败的请求
    if (!getToken()) {
      navigate('/login');
      return;
    }
    userApi.getLoginUser().then(() => {
      navigate(SITE_INFO.HOME_LINK);
    }).catch(() => {
      // token 失效等异常场景，回登录页
      navigate('/login');
    });
  }, []);

  return <PageLoading />;
}

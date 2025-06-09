import React, { useEffect } from 'react';
import { SITE_INFO } from '@/configs';
import { useNavigate } from 'react-router-dom';
import { PageLoading } from '@fa/ui';

/**
 * @author xu.pengfei
 * @date 2022/9/22 20:45
 */
export default function index() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(SITE_INFO.HOME_LINK);
  }, []);

  return <PageLoading />;
}

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLoading } from '@fa/ui';
import { userApi } from "@/services";
import {SITE_INFO} from "@/configs";


export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    userApi.getLoginUser().then(() => {
      navigate(SITE_INFO.HOME_LINK);
    });
  }, []);

  return <PageLoading />;
}

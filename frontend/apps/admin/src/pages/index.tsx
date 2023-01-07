import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLoading } from '@fa/ui';
import { userApi } from "@/services";


export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    userApi.getLoginUser().then(() => {
      navigate('/admin');
    });
  }, []);

  return <PageLoading />;
}

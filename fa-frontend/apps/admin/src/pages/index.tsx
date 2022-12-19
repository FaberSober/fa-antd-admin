import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLoading } from '@/components/antd-pro';
import userApi from '@/services/admin/user';

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    userApi.getLoginUser().then(() => {
      navigate('/admin');
    });
  }, []);

  return <PageLoading />;
}

import React, { Suspense } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaFlexRestLayout, PageLoading } from '@fa/ui';
import { Input, Space } from 'antd';
import { useSessionStorage } from 'react-use';

/**
 * 超级管理员ultra管理页面
 * @author xu.pengfei
 * @date 2024/1/11 15:01
 */
export default function UltraIndex() {
  const [pwd, setPwd] = useSessionStorage<string>('ultra', '');

  const isLogin = pwd === window.__ADMIN_SUPER_PWD__;

  return (
    <div className="fa-full-content fa-flex-column">
      <div className="fa-p12 fa-flex-row">
        <div className="fa-h2 fa-mr12">Ultra</div>
        <Space className="fa-flex-1">
          <Link to="/in/ultra/system/user/device">用户登录设备管理</Link>
        </Space>
      </div>

      {isLogin ? (
        <FaFlexRestLayout>
          <Suspense fallback={<PageLoading />}>
            <Outlet />
          </Suspense>
        </FaFlexRestLayout>
      ) : (
        <div className="fa-p12">
          <div>输入密码：</div>
          <Input.Password value={pwd} onChange={(e) => setPwd(e.target.value)} />
        </div>
      )}
    </div>
  );
}

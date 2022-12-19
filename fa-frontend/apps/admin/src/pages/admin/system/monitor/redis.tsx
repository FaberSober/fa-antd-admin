import React, { useContext } from 'react';
import { UserLayoutContext } from '@/layout/UserLayout';
import { Button } from 'antd';

/**
 * phpRedisAdmin
 * @author xu.pengfei
 * @date 2022/11/29
 */
export default function redis() {
  const { systemConfig } = useContext(UserLayoutContext);

  function refreshIframe() {
    (document.getElementById('phpRedisAdmin') as any).contentWindow.location = systemConfig.phpRedisAdmin;
  }

  return (
    <div className="fa-full-content">
      <iframe
        id="phpRedisAdmin"
        src={systemConfig.phpRedisAdmin}
        className="fa-full-content"
        style={{ width: '100%', height: '100%', border: 'none', margin: 0 }}
      />

      <Button onClick={refreshIframe} style={{ position: 'relative', top: 10, left: 180 }}>
        刷新
      </Button>
    </div>
  );
}

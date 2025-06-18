import React, { useContext } from 'react';
import { Button, Space } from 'antd';
import { WebSocketLayoutContext } from '@features/fa-admin-pages/layout/websocket';
import { FaFlexRestLayout } from '@fa/ui';

/**
 * log monitor
 * @author xu.pengfei
 * @date 2024/11/27 17:39
 */
export default function LogMonitor() {
  const { sendMessage } = useContext(WebSocketLayoutContext);

  function handleStart() {
    sendMessage({
      type: 'WebSocketLogMonitor',
      data: { action: 'start' },
    });
  }

  function handleStop() {
    sendMessage({
      type: 'WebSocketLogMonitor',
      data: { action: 'stop' },
    });
  }

  return (
    <div className="fa-full-content fa-flex-column">
      <Space className="fa-mb12">
        <Button onClick={handleStart} type="primary">
          开始监听
        </Button>
        <Button onClick={handleStop}>结束监听</Button>
      </Space>

      <FaFlexRestLayout></FaFlexRestLayout>
    </div>
  );
}

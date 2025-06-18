import React, { useContext, useEffect } from 'react';
import { Progress, type ProgressProps } from 'antd';
import type { Fa } from '@/types';
import { FaUtils } from '@fa/ui';
import { WebSocketLayoutContext } from '@features/fa-admin-pages/layout/websocket';
import useBus from 'use-bus';

export interface WebSocketTaskProgressProps extends ProgressProps {
  task: Fa.SocketTaskVo;
  onTaskChange?: (task: Fa.SocketTaskVo) => void;
}

/**
 * @author xu.pengfei
 * @date 2024/11/16 21:29
 */
export default function WebSocketTaskProgress({ task, onTaskChange, ...props }: WebSocketTaskProgressProps) {
  const { sendMessage } = useContext(WebSocketLayoutContext);

  useEffect(() => {
    if (task === undefined) return;
    sendMessage({ type: 'WebSocketTaskDemo', data: { taskId: task.taskId } }); // 发送socket绑定任务ID
  }, [task]);

  useBus(
    ['@@ws/RECEIVE/WebSocketTaskDemo'],
    ({ payload }) => {
      if (payload.taskId !== task?.taskId) return;
      if (onTaskChange) {
        onTaskChange(payload);
      }
    },
    [task.taskId],
  );

  function getPer() {
    if (task === undefined || task.total <= 0) return 0;
    return FaUtils.tryToFixed((task.cur / task.total) * 100, 0);
  }

  return <Progress percent={getPer()} {...props} />;
}

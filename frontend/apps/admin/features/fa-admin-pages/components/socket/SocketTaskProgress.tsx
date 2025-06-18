import React, { useEffect } from 'react';
import { useSocketIO } from '@features/fa-admin-pages/hooks';
import { Progress, type ProgressProps } from 'antd';
import type { Fa } from '@/types';
import { FaUtils } from '@fa/ui';

export interface SocketTaskProgressProps extends ProgressProps {
  task: Fa.SocketTaskVo;
  onTaskChange?: (task: Fa.SocketTaskVo) => void;
}

/**
 * @author xu.pengfei
 * @date 2023/6/12 15:29
 */
export default function SocketTaskProgress({ task, onTaskChange, ...props }: SocketTaskProgressProps) {
  const { ready, socketInstance, socketEmit } = useSocketIO({
    // onConnect: () => console.log('Client has connected to the server!'),
    // onDisconnect: () => console.log('The client has disconnected!'),
  });

  useEffect(() => {
    if (!ready) return;

    socketInstance.on('on_progress', (data: Fa.SocketTaskVo) => {
      if (onTaskChange) {
        onTaskChange(data);
      }
    });
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    if (task === undefined) return;

    socketEmit('link_task', task.taskId);
  }, [task, ready]);

  function getPer() {
    if (task === undefined || task.total <= 0) return 0;
    return FaUtils.tryToFixed((task.cur / task.total) * 100, 0);
  }

  return <Progress percent={getPer()} {...props} />;
}

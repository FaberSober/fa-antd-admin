import React from 'react';
import type { Fa } from '@/types';
import dayjs from 'dayjs';

export interface SocketTaskRemainTimeProps {
  task: Fa.SocketTaskVo;
}

/**
 * 计算任务剩余时间，格式：HH:mm:ss
 * @author xu.pengfei
 * @date 2023/6/12 16:46
 */
export default function SocketTaskRemainTime({ task, ...props }: SocketTaskRemainTimeProps) {
  if (task === undefined || task.startTime === undefined) return null;
  if (task.total <= 0 || task.cur <= 0) return null;

  // 计算剩余时间
  const now = dayjs();
  const startTime = dayjs(task.startTime);
  const diff = now.diff(startTime) / 1000; // 已经执行花费的时间，秒

  const leftTime = ((task.total - task.cur) / task.cur) * diff; // 计算剩余时间，秒

  const hour = Math.floor(leftTime / 60 / 60);
  const minute = Math.floor((leftTime - hour * 3600) / 60);
  const second = Math.floor(leftTime - hour * 3600 - minute * 60);

  const num = (v: number) => (v < 10 ? '0' + v : v);

  return (
    <span {...props}>
      {num(hour)}:{num(minute)}:{num(second)}
    </span>
  );
}

import React, { useContext, useState } from 'react';
import { FaUtils } from "@fa/ui";
import { Button, Progress, Space, Tag } from "antd";
import type { Fa } from "@/types";
import { webSocketTaskTestApi } from "@features/fa-admin-demo-pages/services";
import { WebSocketLayoutContext } from "@features/fa-admin-pages/layout/websocket";
import useBus from "use-bus";


/**
 * @author xu.pengfei
 * @date 2023/5/29 11:32
 */
export default function WebSocketTask() {
  const { sendMessage } = useContext(WebSocketLayoutContext);
  const [task, setTask] = useState<Fa.SocketTaskVo>()

  function start() {
    webSocketTaskTestApi.start().then(res => {
      setTask(res.data)
      sendMessage({ type: 'WebSocketTaskDemo', data: { taskId: res.data.taskId } }); // 发送socket绑定任务ID
    })
  }

  function stop() {
    if (task === undefined) return;
    webSocketTaskTestApi.stop({ taskId: task.taskId }).then(res => FaUtils.showResponse(res, '停止任务'))
  }

  useBus(
    ['@@ws/RECEIVE/WebSocketTaskDemo'],
    ({ type, payload }) => {
      if (payload.taskId !== task?.taskId) return;
      setTask(payload)
    },
    [task?.taskId],
  )

  function getPer() {
    if (task === undefined || task.total <= 0) return 0;
    return FaUtils.tryToFixed(task.cur / task.total * 100, 0)
  }

  return (
    <div>
      <Space className="fa-mb12">
        <Button onClick={start}>开启任务</Button>
        <Button onClick={stop}>停止任务</Button>
      </Space>

      <div>
        {task && (
          <div>
            <div>TaskId <Tag>{task.taskId}</Tag> {task.name}: {task.cur} / {task.total}</div>

            <Progress percent={getPer()} />
          </div>
        )}
      </div>
    </div>
  )
}

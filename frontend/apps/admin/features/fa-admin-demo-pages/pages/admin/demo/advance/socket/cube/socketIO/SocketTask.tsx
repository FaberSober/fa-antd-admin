import React, {useEffect, useState} from 'react';
import {FaUtils} from "@fa/ui";
import {Button, Progress, Space} from "antd";
import type {Fa} from "@/types";
import {socketTaskTestApi} from "@features/fa-admin-demo-pages/services";
import {useSocketIO} from "@features/fa-admin-pages/hooks";


/**
 * @author xu.pengfei
 * @date 2023/5/29 11:32
 */
export default function SocketTask() {
  const { ready, socketInstance, socketEmit } = useSocketIO({
    onConnect: () => console.log('Client has connected to the server!'),
    onDisconnect: () => console.log('The client has disconnected!'),
  });

  const [task, setTask] = useState<Fa.SocketTaskVo>()

  function start() {
    socketTaskTestApi.start().then(res => {
      setTask(res.data)
      socketEmit('link_task', res.data.taskId)
    })
  }

  function stop() {
    if (task === undefined) return;
    socketTaskTestApi.stop({ taskId: task.taskId }).then(res => FaUtils.showResponse(res, '停止任务'))
  }

  useEffect(() => {
    if (!ready) return;

    socketInstance.on('on_progress', (data: Fa.SocketTaskVo) => setTask(data));
  }, [ready]);

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
            <div>TaskId[{task.taskId}] {task.name}: {task.cur} / {task.total}</div>

            <Progress percent={getPer()} />
          </div>
        )}
      </div>
    </div>
  )
}

import React, {useState} from 'react';
import type {Fa} from "@/types";
import {Button, Space} from "antd";
import {webSocketTaskTestApi} from "@features/fa-admin-demo-pages/services";
import {WebSocketTaskProgress, SocketTaskRemainTime} from "@features/fa-admin-pages/components";
import { FaUtils } from "@fa/ui";

/**
 * @author xu.pengfei
 * @date 2023/6/12 15:27
 */
export default function WebSocketTaskCube() {
  const [task, setTask] = useState<Fa.SocketTaskVo>()

  function start() {
    webSocketTaskTestApi.start().then(res => setTask(res.data))
  }

  function stop() {
    if (task === undefined) return;
    webSocketTaskTestApi.stop({ taskId: task.taskId }).then(res => FaUtils.showResponse(res, '停止任务'))
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
            <div className="fa-flex-row-center">
              <div>TaskId[{task.taskId}] {task.name}: {task.cur} / {task.total} 。 </div>
              <div>
                剩余时间：
                <SocketTaskRemainTime task={task} />
              </div>
            </div>

            <WebSocketTaskProgress task={task} onTaskChange={setTask} />
          </div>
        )}
      </div>
    </div>
  )
}

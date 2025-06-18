import React, {useState} from 'react';
import type {Fa} from "@/types";
import {Button, Space} from "antd";
import {socketTaskTestApi} from "@features/fa-admin-demo-pages/services";
import {SocketTaskProgress, SocketTaskRemainTime} from "@features/fa-admin-pages/components";

/**
 * @author xu.pengfei
 * @date 2023/6/12 15:27
 */
export default function SocketTaskCube() {
  const [task, setTask] = useState<Fa.SocketTaskVo>()

  function start() {
    socketTaskTestApi.start().then(res => setTask(res.data))
  }

  return (
    <div>
      <Space className="fa-mb12">
        <Button onClick={start}>开启任务</Button>
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

            <SocketTaskProgress task={task} onTaskChange={setTask} />
          </div>
        )}
      </div>
    </div>
  )
}

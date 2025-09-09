import { Flow, FlwEnums } from "@/types";
import { FaApiScrollList, FaApiScrollListRef } from '@features/fa-admin-pages/components';
import { flowTaskApi } from "@features/fa-flow-pages/services";
import { Form, Input, Splitter, Tag } from "antd";
import { useRef, useState } from "react";
import useBus from "use-bus";
import FlowInstanceDeal from "../components/FlowInstanceDeal";


export default function FlowTodo() {

  const [task, setTask] = useState<Flow.FlowTaskRet>()
  const scrollListRef = useRef<FaApiScrollListRef>(null);

  /**
   * 刷新列表数据
   * 先调用FaApiScrollList组件内部的refresh方法，然后清空选中的任务
   */
  function refresh() {
    scrollListRef.current?.refresh();
    setTask(undefined)
  }

  // 接收websocket处理组件FlowTaskWebsocketProcessor发布的刷新任务数量信息
  useBus(
    ['@@api/FLOW/REFRESH_TASK_COUNT'],
    () => refresh(),
    [],
  )

  return (
    <div className='fa-full-content'>
      <Splitter>
        {/* 左侧面板 */}
        <Splitter.Panel defaultSize={300} min={240} max="50%" collapsible>
          <div className="fa-full fa-flex-column fa-relative">
            <FaApiScrollList
              ref={scrollListRef}
              apiPage={flowTaskApi.pagePendingApproval}
              searchKey="processName"
              sorter="t.create_time DESC"
              renderItem={(item: Flow.FlowTaskRet, index: number) => {
                return (
                  <div key={item.taskId} className="fa-mt6 fa-mb6">
                    <div
                      className="fa-card fa-hover"
                      style={{borderColor: task?.taskId === item.taskId ? 'var(--primary-color)' : ''}}
                      onClick={() => setTask(item)}
                    >
                      <div className="fa-flex-row-center">
                        <div className="fa-flex-1">{item.processName}</div>
                        <div>
                          <Tag>{FlwEnums.TaskStateMap[item.instanceState as FlwEnums.TaskState]}</Tag>
                        </div>
                      </div>

                      <div className="fa-flex-row-center">
                        <div className="fa-subtitle">当前所在节点:</div>
                        <div>{item.taskName}</div>
                      </div>

                      <div className="fa-flex-row-center">
                        <div className='fa-flex-1'>{item.launchBy}</div>
                        <div>提交于{item.launchTime}</div>
                      </div>
                    </div>
                  </div>
                )
              }}
              renderFilterFormItems={() => (
                <div>
                  <Form.Item name="createBy">
                    <Input placeholder="创建人名称" allowClear />
                  </Form.Item>
                </div>
              )}
            />
          </div>
        </Splitter.Panel>

        {/* 右侧面板 */}
        <Splitter.Panel>
          <div className="fa-flex-column fa-full fa-relative">
            {task && (
              <div>
                <FlowInstanceDeal instanceId={task.instanceId} taskId={task.taskId} onSuccess={() => refresh()} />
              </div>
            )}
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
}

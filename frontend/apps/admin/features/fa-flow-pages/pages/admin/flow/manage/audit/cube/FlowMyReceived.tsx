import { Flow, FlwEnums } from "@/types";
import { Allotment } from "allotment";
import { Form, Input, Tag } from "antd";
import { useRef, useState } from "react";
import { FaApiScrollList, FaApiScrollListRef } from '@features/fa-admin-pages/components';
import { flowTaskApi } from "@features/fa-flow-pages/services";
import FlowInstanceDeal from "../components/FlowInstanceDeal";

/**
 * 流程任务管理 - 我收到的任务组件
 * 用于显示当前用户收到的所有任务列表，包括抄送任务等
 */
export default function FlowMyReceived() {
  // 当前选中的任务信息
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

  return (
    <div className='fa-full-content'>
      <Allotment defaultSizes={[150]}>
        {/* 左侧面板 - 我收到的任务列表 */}
        <Allotment.Pane minSize={200} maxSize={400}>
          <div className="fa-full-content fa-flex-column">
            <FaApiScrollList
              ref={scrollListRef}
              apiPage={flowTaskApi.pageMyReceived}
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
        </Allotment.Pane>

        {/* 右侧面板 - 任务详情处理 */}
        <div className="fa-flex-column fa-full">
          {task && (
            <div>
              <FlowInstanceDeal instanceId={task.instanceId} taskId={task.taskId} onSuccess={() => refresh()} />
            </div>
          )}
        </div>
      </Allotment>
    </div>
  );
}

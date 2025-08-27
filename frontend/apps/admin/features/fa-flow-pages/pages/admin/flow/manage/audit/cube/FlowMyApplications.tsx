import { Flow, FlwEnums } from "@/types";
import { FaFlexRestLayout, useTableQueryParams } from "@fa/ui";
import { Allotment } from "allotment";
import { Button, Space, Tag } from "antd";
import { useState } from "react";
import { flowTaskApi } from "@features/fa-flow-pages/services";
import FlowInstanceDeal from "../components/FlowInstanceDeal";

export default function FlowMyApplications() {
  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, setExtraParams, fetchPageList, loading, list, paginationProps } =
      useTableQueryParams<Flow.FlowTaskRet>(flowTaskApi.pagePendingApproval, { extraParams: {}, sorter: { field: 't.createTime', order: 'descend' } }, '流程任务')
  const [task, setTask] = useState<Flow.FlowTaskRet>()

  return (
    <div className='fa-full-content'>
      <Allotment defaultSizes={[150]}>
        {/* 左侧面板 */}
        <Allotment.Pane minSize={200} maxSize={400}>
          <div className="fa-full-content fa-flex-column">
            <Space className="fa-mb12">
              <Button loading={loading} onClick={fetchPageList}>刷新</Button>
            </Space>

            <FaFlexRestLayout>
              {list.map(i => {
                return (
                  <div key={i.taskId} className="fa-card fa-hover fa-mb12 fa-flex-column" onClick={() => setTask(i)}>
                    <div className="fa-flex-row-center">
                      <div className='fa-flex-1'>{i.processName}</div>
                      <div>
                        <Tag>{FlwEnums.TaskStateMap[i.instanceState]}</Tag>
                      </div>
                    </div>

                    <div className="fa-flex-row-center">
                      <div className="fa-subtitle">当前所在节点:</div>
                      <div>{i.taskName}</div>
                    </div>

                    <div className="fa-flex-row-center">
                      <div className='fa-flex-1'>{i.launchBy}</div>
                      <div>提交于{i.launchTime}</div>
                    </div>
                  </div>
                )
              })}
            </FaFlexRestLayout>
          </div>
        </Allotment.Pane>

        {/* 右侧面板 */}
        <div className="fa-flex-column fa-full">
          {task && (
            <div>
              <FlowInstanceDeal instanceId={task.instanceId} taskId={task.taskId} onSuccess={() => {
                fetchPageList()
                setTask(undefined)
              }} />
            </div>
          )}
        </div>
      </Allotment>
    </div>
  );
}

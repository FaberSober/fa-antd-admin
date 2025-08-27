import { Flow, FlwEnums } from "@/types";
import { FaFlexRestLayout, useTableQueryParams } from "@fa/ui";
import { Allotment } from "allotment";
import { Button, Space, Tag } from "antd";
import { useState } from "react";
import { flowTaskApi } from "@features/fa-flow-pages/services";
import FlowInstanceDeal from "../components/FlowInstanceDeal";

/**
 * 流程任务管理 - 我的申请组件
 * 用于显示当前用户申请的所有流程任务列表，包括待审批、审批中和已完成的任务
 */
export default function FlowMyApplications() {
  // 使用表格查询参数Hook，获取我申请的流程任务列表
  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, setExtraParams, fetchPageList, loading, list, paginationProps } =
      useTableQueryParams<Flow.FlowTaskRet>(flowTaskApi.pageMyApplications, { extraParams: {}, sorter: { field: 't.createTime', order: 'descend' } }, '流程任务')

  // 当前选中的任务信息
  const [task, setTask] = useState<Flow.FlowTaskRet>()

  /**
   * 刷新任务列表
   * 重新获取最新的任务数据
   */
  const handleRefresh = () => {
    fetchPageList();
  };

  /**
   * 选择任务处理函数
   * @param selectedTask - 被选中的任务对象
   */
  const handleTaskSelect = (selectedTask: Flow.FlowTaskRet) => {
    setTask(selectedTask);
  };

  /**
   * 任务处理成功后的回调函数
   * 刷新列表并清除当前选中的任务
   */
  const handleTaskDealSuccess = () => {
    fetchPageList();
    setTask(undefined);
  };

  return (
    <div className='fa-full-content'>
      <Allotment defaultSizes={[150]}>
        {/* 左侧面板 - 任务列表 */}
        <Allotment.Pane minSize={200} maxSize={400}>
          <div className="fa-full-content fa-flex-column">
            <Space className="fa-mb12">
              <Button loading={loading} onClick={handleRefresh}>刷新</Button>
            </Space>

            <FaFlexRestLayout>
              {list.map(i => {
                return (
                  <div
                    key={i.taskId}
                    className="fa-card fa-hover fa-mb12 fa-flex-column"
                    onClick={() => handleTaskSelect(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleTaskSelect(i);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="fa-flex-row-center">
                      <div className='fa-flex-1'>{i.processName}</div>
                      <div>
                        <Tag>{FlwEnums.InstanceStateEnumMap[i.instanceState as FlwEnums.InstanceStateEnum]}</Tag>
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

        {/* 右侧面板 - 任务处理详情 */}
        <div className="fa-flex-column fa-full">
          {task && (
            <div>
              <FlowInstanceDeal instanceId={task.instanceId} taskId={task.taskId} onSuccess={handleTaskDealSuccess} />
            </div>
          )}
        </div>
      </Allotment>
    </div>
  );
}

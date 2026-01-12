import { Flow, FlwEnums } from "@/types";
import { FaApiScrollList, FaApiScrollListRef } from '@features/fa-admin-pages/components';
import { flowTaskApi } from "@features/fa-flow-pages/services";
import { Form, Input, Splitter, Tag } from "antd";
import { useRef, useState } from "react";
import useBus from "use-bus";
import FlowInstanceView from "../components/FlowInstanceView";

/**
 * 流程任务管理 - 我的申请组件
 * 用于显示当前用户申请的所有历史流程实例列表，包括待审批、审批中和已完成的任务
 */
export default function FlowMyApplications() {
  // 当前选中的实例信息
  const [instance, setInstance] = useState<Flow.FlowHisInstanceRet>()
  const scrollListRef = useRef<FaApiScrollListRef>(null);

  /**
   * 刷新列表数据
   * 先调用FaApiScrollList组件内部的refresh方法，然后清空选中的实例
   */
  function refresh() {
    scrollListRef.current?.refresh();
    setInstance(undefined)
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
        {/* 左侧面板 - 我的申请列表 */}
        <Splitter.Panel defaultSize={300} min={240} max="50%" collapsible>
          <div className="fa-full fa-flex-column fa-relative">
            <FaApiScrollList
              ref={scrollListRef}
              apiPage={flowTaskApi.pageMyApplications}
              searchKey="processName"
              sorter="t.create_time DESC"
              renderItem={(item: Flow.FlowHisInstanceRet, index: number) => {
                return (
                  <div key={item.instanceId} className="fa-mt6 fa-mb6">
                    <div
                      className="fa-card fa-hover"
                      style={{borderColor: instance?.instanceId === item.instanceId ? 'var(--primary-color)' : ''}}
                      onClick={() => setInstance(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setInstance(item);
                        }
                      }}
                      tabIndex={0}
                    >
                      <div className="fa-flex-row-center">
                        <div className='fa-flex-1'>{item.processName}</div>
                        <div>
                          <Tag>{FlwEnums.InstanceStateEnumMap[item.instanceState as FlwEnums.InstanceStateEnum]}</Tag>
                        </div>
                      </div>

                      <div className="fa-flex-row-center">
                        <div className="fa-subtitle">当前所在节点:</div>
                        <div>{item.currentNodeName}</div>
                      </div>

                      <div className="fa-flex-row-center">
                        <div className='fa-flex-1'>{item.createBy}</div>
                        <div>提交于{item.createTime}</div>
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
              formStyle={{ marginRight: 12 }}
              bodyStyle={{ scrollbarGutter: 'stable' }}
            />
          </div>
        </Splitter.Panel>

        {/* 右侧面板 - 实例详情 */}
        <Splitter.Panel>
          <div className="fa-flex-column fa-full fa-relative">
            {instance && (
              <FlowInstanceView instanceId={instance.instanceId} onSuccess={() => refresh()} />
            )}
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
}

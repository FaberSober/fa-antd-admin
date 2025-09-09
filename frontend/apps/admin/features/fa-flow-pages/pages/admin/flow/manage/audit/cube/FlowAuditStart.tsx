import { flowCatagoryApi, flowProcessApi } from '@/services';
import { Flow } from '@/types';
import { ApiEffectLayoutContext, BaseDrawer, BaseTree, FaFlexRestLayout, FaUtils } from '@fa/ui';
import DemoFlowLeaveForm from '@features/fa-flow-pages/pages/admin/demo/flow/form/leave/modal/DemoFlowLeaveForm';
import { Button, Form, Space, Splitter } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import { useFlowAuditContext } from '../contexts/FlowAuditContext';


export default function FlowAuditStart() {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const { refreshCount } = useFlowAuditContext();
  const drawerRef = useRef<any>(null);
  const [form] = Form.useForm();

  const [cata, setCata] = useState<Flow.FlowCatagory>();
  const [flows, setFlows] = useState<Flow.FlowProcess[]>([]);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  function onTreeSelect(keys: any[], event: any) {
    setCata(keys.length > 0 ? event.node.sourceData : undefined);
  }

  useEffect(() => {
    getFlows();
  }, [cata]);

  function getFlows() {
    flowProcessApi.list({
      query: { catagoryId: cata?.id },
      sorter: 'sort ASC',
    }).then(res => {
      setFlows(res.data);
    })
  }

  function handleStart() {
    form.submit();
  }

  function handleFormSubmit(flow: Flow.FlowProcess, formValues: any) {
    // start flow
    flowProcessApi.start({ processKey: flow.processKey, args: formValues }).then(res => {
      FaUtils.showResponse(res, '发起流程');
      drawerRef.current?.close();
      // 成功提交审批流程后，刷新任务数量统计
      refreshCount();
    })
  }

  const loading = loadingEffect[flowProcessApi.getUrl('start')];
  return (
    <div className='fa-full-content'>
      <Splitter>
        {/* 左侧面板 */}
        <Splitter.Panel defaultSize={300} min={240} max="50%" collapsible>
          <BaseTree
            // showRoot
            rootName="全部"
            onSelect={onTreeSelect}
            // 自定义配置
            serviceName="分类"
            serviceApi={flowCatagoryApi}
            defaultExpandAll
            showTopAddBtn={false}
          />
        </Splitter.Panel>

        {/* 右侧面板 */}
        <Splitter.Panel>
          <div className="fa-flex-column fa-full fa-relative fa-plr12">
            <div className='fa-flex-row fa-flex-wrap'>
              {flows.map(flow => {
                return (
                  <div key={flow.id}>
                    <BaseDrawer
                      ref={drawerRef}
                      triggerDom={(
                        <div className='fa-card fa-hover'>
                          {flow.processName}
                        </div>
                      )}
                      width={1000}
                    >
                      <div className='fa-full-content-p12 fa-flex-column'>
                        start {flow.processName}
                        <FaFlexRestLayout>
                          {flow.processKey === 'testLeave' && (<DemoFlowLeaveForm form={form} onSuccess={(fv) => handleFormSubmit(flow, fv)} onLoadingChange={setFormLoading} />)}
                          {flow.processKey === 'testLeave2' && (<DemoFlowLeaveForm form={form} onSuccess={(fv) => handleFormSubmit(flow, fv)} onLoadingChange={setFormLoading} />)}
                        </FaFlexRestLayout>

                        <Space>
                          <Button type='primary' onClick={() => handleStart()} loading={loading || formLoading}>提交审批</Button>
                        </Space>
                      </div>
                    </BaseDrawer>
                  </div>
                )
              })}
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  )
}

import { flowCatagoryApi, flowProcessApi } from '@/services';
import { Flow } from '@/types';
import { ApartmentOutlined, FormOutlined } from '@ant-design/icons';
import { BaseDrawer, BaseTree, FaFlexRestLayout, FaLazyContainer, FaUtils, useApiLoading } from '@fa/ui';
import { FaFlowForm, FaWorkFlow } from '@features/fa-flow-pages/components';
import DemoFlowLeaveForm from '@features/fa-flow-pages/pages/admin/demo/flow/form/leave/modal/DemoFlowLeaveForm';
import { Button, Form, Segmented, Space, Splitter } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useFlowAuditContext } from '../contexts/FlowAuditContext';
import FlowEnums from '@features/fa-flow-pages/types/FlowEnums';


export default function FlowAuditStart() {
  const { refreshCount } = useFlowAuditContext();
  const drawerRef = useRef<any>(null);
  const [form] = Form.useForm();

  const [cata, setCata] = useState<Flow.FlowCatagory>();
  const [flows, setFlows] = useState<Flow.FlowProcess[]>([]);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const [tab, setTab] = useState('basic');

  function onTreeSelect(keys: any[], event: any) {
    setCata(keys.length > 0 ? event.node.sourceData : undefined);
  }

  useEffect(() => {
    getFlows();
  }, [cata]);

  function getFlows() {
    flowProcessApi.list({
      query: { catagoryId: cata?.id, processState: 1 },
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

  const loading = useApiLoading([flowProcessApi.getUrl('start')]);
  return (
    <div className='fa-full-content'>
      <Splitter>
        {/* 左侧面板 */}
        <Splitter.Panel defaultSize={300} min={240} max="50%" collapsible>
          <div className="fa-full fa-flex-column fa-relative fa-pr12">
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
          </div>
        </Splitter.Panel>

        {/* 右侧面板 */}
        <Splitter.Panel>
          <div className="fa-flex-column fa-full fa-relative fa-plr12">
            <div className='fa-flex-row fa-flex-wrap fa-gap12'>
              {flows.map(flow => {
                return (
                  <div key={flow.id}>
                    <BaseDrawer
                      ref={drawerRef}
                      triggerDom={(
                        <div className='fa-card fa-hover' style={{ width: 160, height: 100, padding: 12 }}>
                          <div className='fa-h3'>{flow.processName}</div>
                          <div className='fa-text-small fa-text-light100'>{flow.remark}</div>
                        </div>
                      )}
                      size={1000}
                      push={false}
                    >
                      <div className='fa-full-content-p12 fa-flex-column'>
                        <div className='fa-mb12'>
                          <Segmented
                            options={[
                              { label: '发起表单', value: 'basic', icon: <FormOutlined /> },
                              { label: '流程配置', value: 'workflow', icon: <ApartmentOutlined /> },
                            ]}
                            value={tab}
                            onChange={(value) => {
                              setTab(value as string);
                            }}
                          />
                        </div>

                        <FaFlexRestLayout>
                          <FaLazyContainer showCond={tab === 'basic'}>
                            <div className='fa-full-content fa-flex-column'>
                              发起流程：{flow.processName}
                              <FaFlexRestLayout>
                                {/* 系统表单 */}
                                {flow.processKey.startsWith('testLeave') && (<DemoFlowLeaveForm form={form} onSuccess={(fv) => handleFormSubmit(flow, fv)} onLoadingChange={setFormLoading} />)}
                                {/* 自定义表单 */}
                                {flow.formType === FlowEnums.FlowProcessFormType.CUSTOM && (
                                  <div>
                                    <FaFlowForm
                                      formId={flow.formId}
                                      form={form}
                                      onSuccess={(fv) => handleFormSubmit(flow, fv)}
                                      onLoadingChange={setFormLoading}
                                    />
                                  </div>
                                )}
                              </FaFlexRestLayout>

                              <Space>
                                <Button type='primary' onClick={() => handleStart()} loading={loading || formLoading}>提交审批</Button>
                              </Space>
                            </div>
                          </FaLazyContainer>
                          <FaLazyContainer showCond={tab === 'workflow'}>
                            <FaWorkFlow processModel={JSON.parse(flow.modelContent)} readOnly />
                          </FaLazyContainer>
                        </FaFlexRestLayout>

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

import { flowCatagoryApi, flowProcessApi } from '@/services';
import { Flow } from '@/types';
import { BaseDrawer, BaseTree, FaFlexRestLayout, FaUtils } from '@fa/ui';
import DemoFlowLeaveForm from '@features/fa-flow-pages/pages/admin/demo/flow/form/leave/modal/DemoFlowLeaveForm';
import { Allotment } from "allotment";
import { Button, Form, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';


export default function FlowAuditStart() {
  const drawerRef = useRef<any>(null);
  const [form] = Form.useForm();

  const [cata, setCata] = useState<Flow.FlowCatagory>();
  const [flows, setFlows] = useState<Flow.FlowProcess[]>([]);

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
    })
  }

  return (
    <div className='fa-full-content'>
      <Allotment defaultSizes={[100, 500]}>
        {/* 左侧面板 */}
        <Allotment.Pane minSize={200} maxSize={400}>
          <BaseTree
            ref={drawerRef}
            // showRoot
            rootName="全部"
            onSelect={onTreeSelect}
            // 自定义配置
            serviceName="分类"
            serviceApi={flowCatagoryApi}
            defaultExpandAll
            showTopAddBtn={false}
            bodyStyle={{ paddingRight: 12 }}
          />
        </Allotment.Pane>

        {/* 右侧面板 */}
        <div className="fa-flex-column fa-full" style={{ marginLeft: 12 }}>
          <div className='fa-flex-row fa-flex-wrap'>
            {flows.map(flow => {
              return (
                <div key={flow.id}>
                  <BaseDrawer
                    triggerDom={(
                      <div className='fa-btn'>
                        {flow.processName}
                      </div>
                    )}
                    width={1000}
                  >
                    <div className='fa-full-content-p12 fa-flex-column'>
                      start {flow.processName}
                      <FaFlexRestLayout>
                        {flow.processKey === 'testLeave' && (<DemoFlowLeaveForm form={form} onSuccess={(fv) => handleFormSubmit(flow, fv)} />)}
                        {flow.processKey === 'testLeave2' && (<DemoFlowLeaveForm form={form} onSuccess={(fv) => handleFormSubmit(flow, fv)} />)}
                      </FaFlexRestLayout>

                      <Space>
                        <Button type='primary' onClick={() => handleStart()}>提交审批</Button>
                      </Space>
                    </div>
                  </BaseDrawer>
                </div>
              )
            })}
          </div>
        </div>
      </Allotment>
    </div>
  )
}

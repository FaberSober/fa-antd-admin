import React, { useContext, useEffect, useState } from 'react';
import { get } from 'lodash';
import { Flow } from '@/types';
import { BaseDrawerContext, FaFlexRestLayout, FaUtils } from '@fa/ui';
import { Button, Modal, Space, Steps, Form, Checkbox, Typography, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { flowProcessApi } from '@features/fa-flow-pages/services';
import { FaWorkFlow } from '@features/fa-flow-pages/components';
import FlowProcessForm from './FlowProcessForm';

const { Text } = Typography;


interface FlowProcessEditProps {
  item: Flow.FlowProcess;
  onSuccess?: () => void;
  viewOnly?: boolean;
}

export default function FlowProcessEdit({item, onSuccess, viewOnly}: FlowProcessEditProps) {
  const {closeDrawer} = useContext(BaseDrawerContext)
  const [data, setData] = useState({ ...item });
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [extendForm] = Form.useForm();

  useEffect(() => {
    setData({ ...item });
    // 设置基础信息表单数据
    form.setFieldsValue({
      catagoryId: get(item, 'catagoryId'),
      processKey: get(item, 'processKey'),
      processName: get(item, 'processName'),
      processIcon: get(item, 'processIcon'),
      processType: get(item, 'processType'),
      instanceUrl: get(item, 'instanceUrl'),
      remark: get(item, 'remark'),
      useScope: get(item, 'useScope'),
      processState: get(item, 'processState'),
      sort: get(item, 'sort'),
    });
    // 设置扩展配置表单数据
    extendForm.setFieldsValue({
      submitterPermission: get(item, 'submitterPermission', false),
    });
  }, [item, form, extendForm]);

  function handlePublish() {
    Modal.confirm({
      title: '发布流程',
      content: '确定要发布该流程吗？',
      onOk: () => {
        flowProcessApi.publish(data).then(res => {
          FaUtils.showResponse(res, '发布流程');
          onSuccess?.();
          closeDrawer();
        });
      },
    });
  }

  return (
    <div className='fa-full-content-p12 fa-flex-column'>
      <div className='fa-pb12'>
        {!viewOnly && (
          <div className='fa-flex-row-center'>
            <div style={{width: 100}}></div>
            <div className='fa-flex-1 fa-flex-center'>
              <Steps
                style={{width: 450}}
                current={current}
                onChange={setCurrent}
                items={[
                  { title: '基础信息' },
                  { title: '流程设计' },
                  { title: '扩展配置' },
                ]}
              />
            </div>
            <Space style={{width: 100}} className='fa-flex-row-end'>
              <Button onClick={handlePublish} type='primary' icon={<SendOutlined />}>发布</Button>
            </Space>
          </div>
        )}
      </div>

      <FaFlexRestLayout>
        {current === 0 && (
          <div className='fa-full-content-p12'>
            <FlowProcessForm
              form={form}
              onFinish={(values) => {
                setData(prev => ({ ...prev, ...values }));
                message.success('基础信息已保存');
              }}
              readOnly={viewOnly}
            />
          </div>
        )}
        {current === 1 && (
          <FaWorkFlow
            processModel={JSON.parse(data.modelContent)}
            onChange={v => setData(prev => ({ ...prev, modelContent: JSON.stringify(v) }))}
          />
        )}
        {current === 2 && (
          <div className='fa-full-content-p12'>
            <Form
              form={extendForm}
              onFinish={(values) => {
                setData(prev => ({ ...prev, ...values }));
                message.success('扩展配置已保存');
              }}
              {...FaUtils.formItemFullLayout}
            >
              <Form.Item
                name="submitterPermission"
                valuePropName="checked"
                label="提交人权限"
              >
                <Checkbox disabled={viewOnly}>
                  第一个审批节点通过后，提交人仍可撤销申请
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  第一个审批节点通过后，提交人仍可撤销申请（配置前已发起的申请不生效）
                </Text>
              </Form.Item>
            </Form>
          </div>
        )}
      </FaFlexRestLayout>
    </div>
  );
}

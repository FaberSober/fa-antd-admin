import { Flw } from '@/types';
import { Checkbox, Form, Input, Radio, Select, Switch } from 'antd';
import React from 'react';
import { useWorkFlowStore } from '../../stores/useWorkFlowStore';
import './index.scss'


export interface StartNodeAdvanceFormProps {
  node: Flw.Node;
}

/**
 * @author xu.pengfei
 * @date 2026-01-02 10:38:59
 */
export default function StartNodeAdvanceForm({ node }: StartNodeAdvanceFormProps) {
  const [form] = Form.useForm();

  const readOnly = useWorkFlowStore(state => state.readOnly);

  return (
    <Form form={form} disabled={readOnly} className='fa-full-w' styles={{ label: {width: 90} }} className='fa-p12'>
      <div>
        <div className='fa-text-b fa-mb12'>操作设置</div>
        <div>
          <div className='fa-workflow-node-btn-cell'>
            <Checkbox>提交</Checkbox>
            <Input />
          </div>
          <div className='fa-workflow-node-btn-cell'>
            <Checkbox>暂存</Checkbox>
            <Input />
          </div>
          <div className='fa-workflow-node-btn-cell'>
            <Checkbox>撤回</Checkbox>
            <Input />
          </div>
          <div className='fa-workflow-node-btn-cell'>
            <Checkbox>催办</Checkbox>
            <Input />
          </div>
          <div className='fa-workflow-node-btn-cell'>
            <Checkbox>打印</Checkbox>
            <Input />
          </div>
        </div>

        <Form.Item name="titleFormatType" label="标题设置" className='fa-mb12'>
          <Radio.Group
            options={[
              { label: '默认', value: 1 },
              { label: '自定义', value: 2 },
            ]}
          />
        </Form.Item>
        <Input className='fa-mb12' />

        <Form.Item name="exceptionHandleType" label="异常处理" tooltip="审批节点内设置的审批人员异常时遵循该规则" className='fa-mb12'>
          <Select
            options={[
              { label: '超级管理员', value: 1 },
              { label: '指定人员', value: 2 },
              { label: '上一节点审批人指定', value: 3 },
              { label: '默认审批通过', value: 4 },
              { label: '无法提交', value: 5 },
            ]}
          />
        </Form.Item>

        <Form.Item name="needSign" label="手写签名" tooltip="发起人在进行流程撤回操作时需手写签名" className='fa-mb12'>
          <Switch />
        </Form.Item>
        <Form.Item name="needComment" label="意见填写" tooltip="发起人在进行流程撤回操作需填写意见" className='fa-mb12'>
          <Switch />
        </Form.Item>
      </div>
    </Form>
  );
}

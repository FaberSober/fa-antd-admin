import { Flw } from '@/types';
import { Checkbox, Form, Input, Radio, Select, Switch } from 'antd';
import React, { useEffect } from 'react';
import { useWorkFlowStore } from '../../stores/useWorkFlowStore';
import './index.scss'
import { useNode } from '../../hooks';


export interface StartNodeAdvanceFormProps {
  node: Flw.Node;
}

/**
 * @author xu.pengfei
 * @date 2026-01-02 10:38:59
 */
export default function StartNodeAdvanceForm({ node }: StartNodeAdvanceFormProps) {
  const [form] = Form.useForm();

  const updateNode = useWorkFlowStore(state => state.updateNode);
  const readOnly = useWorkFlowStore(state => state.readOnly);

  const { nodeCopy, setNodeCopy } = useNode(node)

  useEffect(() => {
    console.log('node change', node)
  }, [node]);

  useEffect(() => {
    const extendConfig = node.extendConfig || {}
    form.setFieldsValue({
      btnSubmitValid: extendConfig.btnSubmitValid,
      btnSubmitText: extendConfig.btnSubmitText,
      btnDraftValid: extendConfig.btnDraftValid,
      btnDraftText: extendConfig.btnDraftText,
      btnRevokeValid: extendConfig.btnRevokeValid,
      btnRevokeText: extendConfig.btnRevokeText,
      btnPressValid: extendConfig.btnPressValid,
      btnPressText: extendConfig.btnPressText,
      btnPrintValid: extendConfig.btnPrintValid,
      btnPrintText: extendConfig.btnPrintText,
      titleType: extendConfig.titleType,
      titleFormat: extendConfig.titleFormat,
      errorRule: extendConfig.errorRule,
      btnSignValid: extendConfig.btnSignValid,
      btnCommentValid: extendConfig.btnCommentValid,
    })
  }, [form, node]);

  async function onChange(av: any) {
    try {
      const nodeNew = {
        ...nodeCopy,
        extendConfig: {
          ...nodeCopy.extendConfig,
          ...av,
        }
      }
      setNodeCopy(nodeNew)
      updateNode(nodeNew);
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Form form={form} disabled={readOnly} className='fa-full-w fa-p12' styles={{ label: {width: 90} }}
      onValuesChange={(cv, av) => {
        // console.log('cv', cv, 'av', av)
        onChange(av)
      }}
    >
      <div>
        <div className='fa-text-b fa-mb12'>操作设置</div>
        <div>
          <div className='fa-workflow-node-btn-cell'>
            <Form.Item name="btnSubmitValid" noStyle valuePropName="checked">
              <Checkbox>提交</Checkbox>
            </Form.Item>
            <Form.Item name="btnSubmitText" noStyle>
              <Input placeholder='提交' />
            </Form.Item>
          </div>
          <div className='fa-workflow-node-btn-cell'>
            <Form.Item name="btnDraftValid" noStyle valuePropName="checked">
              <Checkbox>暂存</Checkbox>
            </Form.Item>
            <Form.Item name="btnDraftText" noStyle>
              <Input placeholder='暂存' />
            </Form.Item>
          </div>
          <div className='fa-workflow-node-btn-cell'>
            <Form.Item name="btnRevokeValid" noStyle valuePropName="checked">
              <Checkbox>撤回</Checkbox>
            </Form.Item>
            <Form.Item name="btnRevokeText" noStyle>
              <Input placeholder='撤回' />
            </Form.Item>
          </div>
          <div className='fa-workflow-node-btn-cell'>
            <Form.Item name="btnPressValid" noStyle valuePropName="checked">
              <Checkbox>催办</Checkbox>
            </Form.Item>
            <Form.Item name="btnPressText" noStyle>
              <Input placeholder='催办' />
            </Form.Item>
          </div>
          <div className='fa-workflow-node-btn-cell'>
            <Form.Item name="btnPrintValid" noStyle valuePropName="checked">
              <Checkbox>打印</Checkbox>
            </Form.Item>
            <Form.Item name="btnPrintText" noStyle>
              <Input placeholder='打印' />
            </Form.Item>
          </div>
        </div>

        <Form.Item name="titleType" label="标题设置" className='fa-mb12'>
          <Radio.Group
            options={[
              { label: '默认', value: 1 },
              { label: '自定义', value: 2 },
            ]}
          />
        </Form.Item>
        <Form.Item name="titleFormat" noStyle>
          <Input className='fa-mb12' placeholder='{发起用户名}的{流程名称}' />
        </Form.Item>

        <Form.Item name="errorRule" label="异常处理" tooltip="审批节点内设置的审批人员异常时遵循该规则" className='fa-mb12'>
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

        <Form.Item name="btnSignValid" label="手写签名" tooltip="发起人在进行流程撤回操作时需手写签名" className='fa-mb12'>
          <Switch />
        </Form.Item>
        <Form.Item name="btnCommentValid" label="意见填写" tooltip="发起人在进行流程撤回操作需填写意见" className='fa-mb12'>
          <Switch />
        </Form.Item>
      </div>
    </Form>
  );
}

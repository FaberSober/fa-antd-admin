import { rbacRoleApi } from '@/services';
import { Flw } from '@/types';
import { Form } from 'antd';
import React, { useState } from 'react';
import { useNode } from '../../hooks';
import { RbacRoleSelect } from '@/components';
import { useWorkFlowStore } from '../../stores/useWorkFlowStore';

export interface StartNodeBasicFormProps {
  node: Flw.Node;
}

/**
 * @author xu.pengfei
 * @date 2026-01-02 09:55:40
 */
export default function StartNodeBasicForm({ node }: StartNodeBasicFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)

  const refreshNode = useWorkFlowStore(state => state.refreshNode);
  const readOnly = useWorkFlowStore(state => state.readOnly);

  const { nodeCopy, setNodeCopy, updateNodeProps } = useNode(node)

  async function onFinish(fieldsValue: any) {
    try {
      setLoading(true)
      const res = await rbacRoleApi.getByIds(fieldsValue.nodeAssigneeIds);
      const nodeAssigneeList = res.data.map(i => ({ id: i.id, name: i.name }))
      const nodeNew = {
        ...nodeCopy,
        nodeAssigneeList,
      }
      setNodeCopy(nodeNew)
      // 这里node是使用根config传来的节点引用，修改node内容，但不修改引用
      Object.assign(node, nodeNew); // Object.assign(a, b); 会把 b 的属性复制到 a 上，不会改变 a 的引用。
      refreshNode();
      setLoading(false)
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} disabled={readOnly} className='fa-p12'>
      <Form.Item name="nodeAssigneeIds" label="发起角色" tooltip="谁可以发起此审批（不指定则默认所有人都可发起此审批）">
        <RbacRoleSelect mode="multiple" />
      </Form.Item>
    </Form>
  );
}

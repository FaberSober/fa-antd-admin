import { rbacRoleApi } from '@/services';
import { Flw } from '@/types';
import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
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

  const updateNode = useWorkFlowStore(state => state.updateNode);
  const readOnly = useWorkFlowStore(state => state.readOnly);

  const { nodeCopy, setNodeCopy } = useNode(node)

  useEffect(() => {
    form.setFieldsValue({
      nodeAssigneeIds: (node.nodeAssigneeList||[]).map(i => i.id),
    })
  }, []);

  async function onChange(fieldsValue: any) {
    try {
      const res = await rbacRoleApi.getByIds(fieldsValue.nodeAssigneeIds);
      const nodeAssigneeList = res.data.map(i => ({ id: i.id, name: i.name }))
      const nodeNew = {
        ...nodeCopy,
        nodeAssigneeList,
      }
      setNodeCopy(nodeNew)
      updateNode(nodeNew);
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Form form={form} layout="vertical" disabled={readOnly} className='fa-p12'
      onValuesChange={(cv, av) => {
        onChange(av)
      }}
    >
      <Form.Item name="nodeAssigneeIds" label="发起角色" tooltip="谁可以发起此审批（不指定则默认所有人都可发起此审批）">
        <RbacRoleSelect mode="multiple" />
      </Form.Item>
    </Form>
  );
}

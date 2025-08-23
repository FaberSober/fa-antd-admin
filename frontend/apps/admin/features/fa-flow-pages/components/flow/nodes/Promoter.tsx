import React, { useContext, useMemo, useState } from 'react';
import { Button, Form, Input, Space } from "antd";
import { RollbackOutlined, SaveOutlined } from "@ant-design/icons";
import { Flw } from "@features/fa-flow-pages/types";
import { FaIcon } from '@fa/icons';
import { BaseDrawer, FaFlexRestLayout, useOpen } from "@fa/ui";
import AddNode from './AddNode';
import { useNode } from '../hooks';
import { RbacRoleSelect } from "@features/fa-admin-pages/components";
import FaWorkFlowContext from "@features/fa-flow-pages/components/flow/context/FaWorkFlowContext";
import { rbacRoleApi } from "@features/fa-admin-pages/services";


export interface PromoterProps {
  /** 流程配置节点Node JSON */
  node: Flw.Node;
}

/**
 * @author xu.pengfei
 * @date 2025/8/19 20:22
 */
export default function Promoter({node}: PromoterProps) {
  const [form] = Form.useForm();
  const [open, show, hide] = useOpen()
  const [loading, setLoading] = useState(false)

  const {refreshNode} = useContext(FaWorkFlowContext)
  const {nodeCopy, setNodeCopy, updateNodeProps} = useNode(node)

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
      hide()
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  const text = useMemo(() => {
    if (nodeCopy.nodeAssigneeList && nodeCopy.nodeAssigneeList.length > 0) {
      return nodeCopy.nodeAssigneeList.map(item => item.name).join("、")
    } else {
      return "所有人"
    }
  }, [nodeCopy])

  function showDrawer() {
    show()
    form.setFieldsValue({
      nodeAssigneeIds: nodeCopy.nodeAssigneeList ? nodeCopy.nodeAssigneeList.map(item => item.id) : []
    })
  }

  return (
    <div className="node-wrap">
      <div className="node-wrap-box start-node" onClick={showDrawer}>
        <div className="title" style={{background: '#576a95'}}>
          <FaIcon icon="fa-solid fa-user-large"/>
          <span>{nodeCopy.nodeName}</span>
        </div>
        <div className="content">
          <span>{text}</span>
        </div>
      </div>

      <BaseDrawer
        open={open}
        onClose={() => hide()}
        title={(
          <Input value={nodeCopy.nodeName} variant="filled" onChange={e => updateNodeProps('nodeName', e.target.value)}/>
        )}
      >
        <Form form={form} layout="vertical" className="fa-flex-column fa-full" onFinish={onFinish}>
          <FaFlexRestLayout>
            <Form.Item name="nodeAssigneeIds" label="发起角色" tooltip="谁可以发起此审批（不指定则默认所有人都可发起此审批）">
              <RbacRoleSelect mode="multiple"/>
            </Form.Item>
          </FaFlexRestLayout>

          <Space>
            <Button type="primary" icon={<SaveOutlined/>} htmlType="submit" loading={loading}>保存</Button>
            <Button onClick={() => hide()} icon={<RollbackOutlined />}>取消</Button>
          </Space>
        </Form>
      </BaseDrawer>

      <AddNode parentNode={node}/>
    </div>
  )
}

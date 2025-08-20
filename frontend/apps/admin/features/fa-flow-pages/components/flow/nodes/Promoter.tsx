import React, { useContext, useMemo } from 'react';
import { Button, Form, Input, Space } from "antd";
import { RollbackOutlined, SaveOutlined } from "@ant-design/icons";
import { Flow } from "@features/fa-flow-pages/types";
import { FaIcon } from '@fa/icons';
import { BaseDrawer, FaFlexRestLayout, useOpen } from "@fa/ui";
import AddNode from './AddNode';
import { useNode } from '../hooks';
import { RbacRoleSelect } from "@features/fa-admin-pages/components";
import FaWorkFlowContext from "@features/fa-flow-pages/components/flow/context/FaWorkFlowContext";


export interface PromoterProps {
  /** 流程配置节点Node JSON */
  node: Flow.Node;
}

/**
 * @author xu.pengfei
 * @date 2025/8/19 20:22
 */
export default function Promoter({node}: PromoterProps) {
  const [form] = Form.useForm();
  const [open, show, hide] = useOpen()

  const {refreshNode} = useContext(FaWorkFlowContext)
  const {nodeCopy, setNodeCopy, updateNodeProps} = useNode(node)

  function onFinish(fieldsValue: any) {
    const nodeNew = {
      ...nodeCopy,
      nodeAssigneeList: fieldsValue.nodeAssigneeIds.map((id: string) => ({ id, name: 'xxx' }))
    }
    setNodeCopy(nodeNew)
    Object.assign(node, nodeNew); // Object.assign(a, b); 会把 b 的属性复制到 a 上，不会改变 a 的引用。
    refreshNode();
    hide()
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
            <Button type="primary" icon={<SaveOutlined/>} htmlType="submit">保存</Button>
            <Button onClick={() => hide()} icon={<RollbackOutlined />}>取消</Button>
          </Space>
        </Form>
      </BaseDrawer>

      <AddNode node={node}/>
    </div>
  )
}

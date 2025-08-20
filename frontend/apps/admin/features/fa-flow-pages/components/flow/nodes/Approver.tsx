import React, { useContext, useMemo, useState } from 'react';
import { Flow, FlowEnums } from "@features/fa-flow-pages/types";
import { FaIcon } from "@fa/icons";
import { Button, Form, Input, Space } from "antd";
import AddNode from "@features/fa-flow-pages/components/flow/nodes/AddNode";
import { BaseDrawer, FaFlexRestLayout, useOpen, UserSearchSelect } from '@fa/ui';
import { NodeCloseBtn, NodeSetTypeSelect } from "@features/fa-flow-pages/components/flow/cubes";
import FaWorkFlowContext from "@features/fa-flow-pages/components/flow/context/FaWorkFlowContext";
import { useNode } from "@features/fa-flow-pages/components/flow/hooks";
import { RollbackOutlined, SaveOutlined } from "@ant-design/icons";

const {NodeSetType} = FlowEnums;


export interface ApproverProps {
  /** 流程配置节点Node JSON */
  node: Flow.Node;
  parentNode?: Flow.Node | Flow.ConditionNode;
}

/**
 * @author xu.pengfei
 * @date 2025/8/19 22:11
 */
export default function Approver({node, parentNode}: ApproverProps) {
  const [form] = Form.useForm();
  const [open, show, hide] = useOpen()
  const [loading, setLoading] = useState(false)

  const {refreshNode} = useContext(FaWorkFlowContext)
  const {nodeCopy, setNodeCopy, updateNodeProps} = useNode(node)

  function toText(nodeConfig: Flow.Node) {
    if (nodeConfig.setType === NodeSetType.specifyMembers) {
      if (nodeConfig.nodeAssigneeList && nodeConfig.nodeAssigneeList.length > 0) {
        const users = nodeConfig.nodeAssigneeList.map(item => item.name).join("、")
        return users
      } else {
        return false
      }
    } else if (nodeConfig.setType === NodeSetType.supervisor) {
      return nodeConfig.examineLevel === 1 ? '直接主管' : `发起人的第${nodeConfig.examineLevel}级主管`
    } else if (nodeConfig.setType === NodeSetType.role) {
      if (nodeConfig.nodeAssigneeList && nodeConfig.nodeAssigneeList.length > 0) {
        const roles = nodeConfig.nodeAssigneeList.map(item => item.name).join("、")
        return '角色-' + roles
      } else {
        return false
      }
    } else if (nodeConfig.setType === NodeSetType.initiatorSelected) {
      return "发起人自选"
    } else if (nodeConfig.setType === NodeSetType.initiatorThemselves) {
      return "发起人自己"
    } else if (nodeConfig.setType === NodeSetType.department) {
      return "连续多级主管"
    }
    return false;
  }

  const text = useMemo(() => toText(node), [node])

  function delNode() {
    parentNode!.childNode = node.childNode
    refreshNode()
  }

  async function onFinish(fieldsValue: any) {
    try {
      setLoading(true)
      const nodeNew = {
        ...nodeCopy,
        setType: fieldsValue.setType,
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

  function showDrawer() {
    show()
    form.setFieldsValue({
      setType: nodeCopy.setType,
    })
  }

  return (
    <div className="node-wrap">
      <div className="node-wrap-box start-node" onClick={showDrawer}>
        <div className="title" style={{background: '#576a95'}}>
          <FaIcon icon="fa-solid fa-user-large"/>
          <span>{node.nodeName}</span>
          <NodeCloseBtn onClick={() => delNode()}/>
        </div>

        <div className="content">
          {text ? <span>{text}</span> : <span className="placeholder">请选择</span>}
        </div>
      </div>

      <BaseDrawer
        open={open}
        onClose={() => hide()}
        title={(
          <Input value={nodeCopy.nodeName} variant="filled" onChange={e => updateNodeProps('nodeName', e.target.value)}/>
        )}
      >
        <Form
          form={form}
          layout="vertical"
          className="fa-flex-column fa-full"
          onFinish={onFinish}
          onValuesChange={cv => {
            if (cv.setType) {
              updateNodeProps('setType', cv.setType)
            }
          }}
        >
          <FaFlexRestLayout>
            <Form.Item name="setType" label="审批人员类型">
              <NodeSetTypeSelect />
            </Form.Item>
            {nodeCopy.setType === NodeSetType.specifyMembers && (
              <Form.Item name="nodeAssigneeIds" label="审批人员">
                <UserSearchSelect mode="multiple"/>
              </Form.Item>
            )}
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

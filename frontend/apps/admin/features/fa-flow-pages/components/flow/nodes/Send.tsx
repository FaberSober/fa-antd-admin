import React, { useContext, useMemo, useState } from 'react';
import { Flow } from "@features/fa-flow-pages/types";
import { FaIcon } from "@fa/icons";
import { Button, Form, Input, Space } from "antd";
import { BaseDrawer, FaFlexRestLayout, useOpen, UserSearchSelect } from '@fa/ui';
import { NodeCloseBtn } from '../cubes';
import AddNode from './AddNode';
import FaWorkFlowContext from "@features/fa-flow-pages/components/flow/context/FaWorkFlowContext";
import { useNode } from "@features/fa-flow-pages/components/flow/hooks";
import { RollbackOutlined, SaveOutlined } from "@ant-design/icons";
import { userApi } from "@features/fa-admin-pages/services";


export interface SendProps {
  /** 流程配置节点Node JSON */
  node: Flow.Node;
  parentNode?: Flow.Node | Flow.ConditionNode;
}

/**
 * @author xu.pengfei
 * @date 2025/8/19 22:11
 */
export default function Send({ node, parentNode }: SendProps) {
  const [form] = Form.useForm();
  const [open, show, hide] = useOpen()
  const [loading, setLoading] = useState(false)

  const {refreshNode} = useContext(FaWorkFlowContext)
  const {nodeCopy, setNodeCopy, updateNodeProps} = useNode(node)

  async function onFinish(fieldsValue: any) {
    try {
      setLoading(true)
      const res = await userApi.getByIds(fieldsValue.nodeAssigneeIds);
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

  function showDrawer() {
    show()
    form.setFieldsValue({
      nodeAssigneeIds: nodeCopy.nodeAssigneeList ? nodeCopy.nodeAssigneeList.map(item => item.id) : []
    })
  }

  const text = useMemo(() => {
    if (nodeCopy.nodeAssigneeList && nodeCopy.nodeAssigneeList.length > 0) {
      return nodeCopy.nodeAssigneeList.map(item => item.name).join("、")
    } else {
      return "所有人"
    }
  }, [nodeCopy])

  function delNode() {
    parentNode!.childNode = node.childNode
    refreshNode()
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
          {text ? text : '请选择人员' }
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
            <Form.Item name="nodeAssigneeIds" label="抄送人员" tooltip="抄送以站内信的形式发送给选定人员">
              <UserSearchSelect mode="multiple"/>
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

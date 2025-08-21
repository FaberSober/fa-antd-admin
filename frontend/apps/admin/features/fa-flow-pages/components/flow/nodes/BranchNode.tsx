import React, { ReactNode, useState } from 'react';
import { Flow } from "@features/fa-flow-pages/types";
import { NodeCloseBtn } from "@features/fa-flow-pages/components/flow/cubes";
import { Button, Form, Input, Space } from "antd";
import { BaseDrawer, FaFlexRestLayout, useOpen } from "@fa/ui";
import { useConditionNode } from '../hooks';
import { RollbackOutlined, SaveOutlined } from "@ant-design/icons";


export interface BranchNodeProps {
  node: Flow.ConditionNode;
  index: number;
  onDel?: () => void;
  conditionText: string|ReactNode;
  onSubmit?: (cn: Flow.ConditionNode) => void;
}

/**
 * @author xu.pengfei
 * @date 2025/8/21 17:08
 */
export default function BranchNode({node, index, onDel, conditionText, onSubmit}: BranchNodeProps) {
  const [form] = Form.useForm();
  const [open, show, hide] = useOpen()
  const [loading, setLoading] = useState(false)

  const {nodeCopy, setNodeCopy, updateNodeProps} = useConditionNode(node)

  async function onFinish(fieldsValue: any) {
    try {
      setLoading(true)

      if (onSubmit) {
        onSubmit(nodeCopy)
      }

      setLoading(false)
      hide()
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  function showDrawer() {
    show()
    // form.setFieldsValue({
    //   ...nodeCopy,
    // })
  }

  return (
    <>
      <div className="fa-flex-column" onClick={showDrawer}>
        <div className="title">
          <span className="node-title">{node.nodeName}</span>
          <span className="priority-title">优先级{node.priorityLevel}</span>
          <NodeCloseBtn onClick={onDel}/>
        </div>

        <div className="content">
          {conditionText ? <span>{conditionText}</span> : <span className="placeholder">请设置条件</span>}
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
        >
          <FaFlexRestLayout>

          </FaFlexRestLayout>

          <Space>
            <Button type="primary" icon={<SaveOutlined/>} htmlType="submit" loading={loading}>保存</Button>
            <Button onClick={() => hide()} icon={<RollbackOutlined />}>取消</Button>
          </Space>
        </Form>
      </BaseDrawer>
    </>
  )
}

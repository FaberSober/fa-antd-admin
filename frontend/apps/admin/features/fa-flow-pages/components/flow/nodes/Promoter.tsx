import { RollbackOutlined, SaveOutlined } from "@ant-design/icons";
import { FaIcon } from '@fa/icons';
import { BaseDrawer, FaFlexRestLayout, useOpen } from "@fa/ui";
import { Flw } from "@features/fa-flow-pages/types";
import { Button, Form, Input, Space, Tabs } from "antd";
import { useMemo, useState } from 'react';
import { useNode, useNodeAssigneeText } from '../hooks';
import { useWorkFlowStore } from '../stores/useWorkFlowStore';
import AddNode from './AddNode';
import StartNodeBasicForm from './property/StartNodeBasicForm';
import StartNodeAdvanceForm from "./property/StartNodeAdvanceForm";
import NodeFormAuth from "./property/NodeFormAuth";


export interface PromoterProps {
  /** 流程配置节点Node JSON */
  node: Flw.Node;
}

/**
 * 流程节点-流程发起
 * @author xu.pengfei
 * @date 2025/8/19 20:22
 */
export default function Promoter({ node }: PromoterProps) {
  const [form] = Form.useForm();
  const [open, show, hide] = useOpen()
  const [tab, setTab] = useState('basic');

  const text = useNodeAssigneeText(node)
  const updateNodeProps = useWorkFlowStore(state => state.updateNodeProps);

  function showDrawer() {
    show()
    form.setFieldsValue({
      nodeAssigneeIds: node.nodeAssigneeList ? node.nodeAssigneeList.map(item => item.id) : []
    })
  }

  return (
    <div className="node-wrap">
      <div className="node-wrap-box start-node" onClick={showDrawer}>
        <div className="title">
          <FaIcon icon="fa-solid fa-user-large" />
          <span>{node.nodeName}</span>
        </div>
        <div className="content">
          <span>{text}</span>
        </div>
      </div>

      <BaseDrawer
        open={open}
        onClose={() => hide()}
        title={(
          <Input value={node.nodeName} variant="filled" onChange={e => updateNodeProps(node, 'nodeName', e.target.value)} />
        )}
        size={600}
      >
        <div className="fa-flex-column fa-full-content">
          <Tabs
            // 基础设置,高级设置,表单权限,流程事件,流程通知,超时处理
            className='fa-tabs-block'
            items={[
              { key: 'basic', label: '基础设置' },
              { key: 'advance', label: '高级设置' },
              { key: 'formAuth', label: '表单权限' },
              { key: 'flowEvent', label: '流程事件' },
              { key: 'flowNotify', label: '流程通知' },
              { key: 'overtime', label: '超时处理' },
            ]}
            activeKey={tab}
            onChange={setTab}
            size='small'
            tabBarGutter={0}
            styles={{
              header: {marginBottom: 0}
            }}
          />
          <FaFlexRestLayout>
            {tab === 'basic' && (<StartNodeBasicForm node={node} />)}
            {tab === 'advance' && (<StartNodeAdvanceForm node={node} />)}
            {tab === 'formAuth' && (<NodeFormAuth node={node} />)}
          </FaFlexRestLayout>

          {/* <Space className="fa-p12 fa-border-t">
            <Button onClick={handleSave} type="primary" icon={<SaveOutlined />} disabled={readOnly}>保存</Button>
            <Button onClick={hide} icon={<RollbackOutlined />} disabled={readOnly}>取消</Button>
          </Space> */}
        </div>
      </BaseDrawer>

      <AddNode parentNode={node} />
    </div>
  )
}

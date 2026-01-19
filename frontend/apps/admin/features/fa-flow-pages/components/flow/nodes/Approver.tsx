import { RollbackOutlined, SaveOutlined } from "@ant-design/icons";
import { FaIcon } from "@fa/icons";
import { BaseDrawer, FaFlexRestLayout, useOpen } from '@fa/ui';
import { NodeCloseBtn } from "@features/fa-flow-pages/components/flow/cubes";
import { useNode } from "@features/fa-flow-pages/components/flow/hooks";
import AddNode from "@features/fa-flow-pages/components/flow/nodes/AddNode";
import { useWorkFlowStore } from "@features/fa-flow-pages/components/flow/stores/useWorkFlowStore";
import { Flw, FlwEnums } from "@features/fa-flow-pages/types";
import { Button, Input, Space, Tabs } from "antd";
import { useMemo, useState } from 'react';
import ApproverNodeBasicForm from './property/ApproverNodeBasicForm';
import NodeFormAuth from './property/NodeFormAuth';
import { findNodeByKey } from "../utils";

const { NodeSetType } = FlwEnums;


export interface ApproverProps {
  /** 流程配置节点Node JSON */
  node: Flw.Node;
  parentNode?: Flw.ParentNode;
}

/**
 * @author xu.pengfei
 * @date 2025/8/19 22:11
 */
export default function Approver({ node, parentNode }: ApproverProps) {
  const [open, show, hide] = useOpen()
  const [tab, setTab] = useState('basic');

  const deleteNode = useWorkFlowStore(state => state.deleteNode); // 使用 Store 的 deleteNode
  const updateNodeProps = useWorkFlowStore(state => state.updateNodeProps);
  const readOnly = useWorkFlowStore(state => state.readOnly);

  function toText(nodeConfig: Flw.Node) {
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
        return '角色：' + roles
      } else {
        return false
      }
    } else if (nodeConfig.setType === NodeSetType.department) {
      if (nodeConfig.nodeAssigneeList && nodeConfig.nodeAssigneeList.length > 0) {
        const roles = nodeConfig.nodeAssigneeList.map(item => item.name).join("、")
        return '部门：' + roles
      } else {
        return false
      }
    } else if (nodeConfig.setType === NodeSetType.initiatorSelected) {
      return "发起人自选"
    } else if (nodeConfig.setType === NodeSetType.initiatorThemselves) {
      return "发起人自己"
    } else if (nodeConfig.setType === NodeSetType.multiLevelSupervisors) {
      return "连续多级主管"
    } else if (nodeConfig.setType === NodeSetType.code) {
      return "代码接口指定"
    }
    return false;
  }

  const text = useMemo(() => toText(node), [node])

  function delNode() {
    if (parentNode) {
      deleteNode(node); // 使用 Store 方法删除
    } else {
      // 根节点处理（如果需要）
    }
  }

  function showDrawer() {
    show()
  }

  return (
    <div className="node-wrap">
      <div className="node-wrap-box start-node" onClick={showDrawer}>
        <div className="title">
          <FaIcon icon="fa-solid fa-user-large" />
          <span>{node.nodeName}</span>
          <NodeCloseBtn onClick={() => delNode()} />
        </div>

        <div className="content">
          {text ? <span>{text}</span> : <span className="placeholder">请选择</span>}
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
            {tab === 'basic' && (<ApproverNodeBasicForm node={node} />)}
            {/* {tab === 'advance' && (<StartNodeAdvanceForm node={nodeCopy} />)} */}
            {tab === 'formAuth' && (<NodeFormAuth node={node} />)}
          </FaFlexRestLayout>
        </div>
      </BaseDrawer>

      <AddNode parentNode={node} />
    </div>
  )
}

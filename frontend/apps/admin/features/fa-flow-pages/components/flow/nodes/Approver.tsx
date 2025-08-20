import React, { useMemo } from 'react';
import { Flow } from "@features/fa-flow-pages/types";
import { FaIcon } from "@fa/icons";
import { Input } from "antd";
import AddNode from "@features/fa-flow-pages/components/flow/nodes/AddNode";
import { BaseDrawer } from '@fa/ui';
import FlowEnums from "../../../types/FlowEnums";
import { NodeCloseBtn } from "@features/fa-flow-pages/components/flow/cubes";


export interface ApproverProps {
  /** 流程配置节点Node JSON */
  node: Flow.Node;
}

/**
 * @author xu.pengfei
 * @date 2025/8/19 22:11
 */
export default function Approver({node}: ApproverProps) {

  function delNode() {}

  function toText(nodeConfig: Flow.Node) {
    if (nodeConfig.setType === FlowEnums.NodeSetType.specifyMembers) {
      if (nodeConfig.nodeAssigneeList && nodeConfig.nodeAssigneeList.length > 0) {
        const users = nodeConfig.nodeAssigneeList.map(item => item.name).join("、")
        return users
      } else {
        return false
      }
    } else if (nodeConfig.setType === FlowEnums.NodeSetType.supervisor) {
      return nodeConfig.examineLevel == 1 ? '直接主管' : `发起人的第${nodeConfig.examineLevel}级主管`
    } else if (nodeConfig.setType === FlowEnums.NodeSetType.role) {
      if (nodeConfig.nodeAssigneeList && nodeConfig.nodeAssigneeList.length > 0) {
        const roles = nodeConfig.nodeAssigneeList.map(item => item.name).join("、")
        return '角色-' + roles
      } else {
        return false
      }
    } else if (nodeConfig.setType === FlowEnums.NodeSetType.initiatorSelected) {
      return "发起人自选"
    } else if (nodeConfig.setType === FlowEnums.NodeSetType.initiatorThemselves) {
      return "发起人自己"
    } else if (nodeConfig.setType === FlowEnums.NodeSetType.department) {
      return "连续多级主管"
    }
  }

  const text = useMemo(() => toText(node), [node])

  return (
    <div className="node-wrap">
      <BaseDrawer
        triggerDom={(
          <div className="node-wrap-box start-node">
            <div className="title" style={{background: '#576a95'}}>
              <FaIcon icon="fa-solid fa-user-large"/>
              <span>{node.nodeName}</span>
              <NodeCloseBtn onClick={() => delNode()} />
            </div>

            <div className="content">
              {text ? <span>{text}</span> : <span className="placeholder">请选择</span>}
            </div>
          </div>
        )}
        title={(
          <Input value={node.nodeName} variant="filled"/>
        )}
      >
        drawer
      </BaseDrawer>

      <AddNode node={node}/>
    </div>
  )
}

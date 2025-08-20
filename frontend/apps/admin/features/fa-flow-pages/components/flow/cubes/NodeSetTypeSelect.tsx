import React from 'react';
import { Select, SelectProps } from "antd";
import { FlowEnums } from "@features/fa-flow-pages/types";

const {NodeSetType, NodeSetTypeMap} = FlowEnums;

export interface NodeSetTypeSelectProps extends SelectProps {
}

/**
 * @author xu.pengfei
 * @date 2025/8/20 21:36
 */
export default function NodeSetTypeSelect({...props}: NodeSetTypeSelectProps) {
  return (
    <Select
      options={[
        { label: NodeSetTypeMap[NodeSetType.specifyMembers], value: NodeSetType.specifyMembers },
        { label: NodeSetTypeMap[NodeSetType.supervisor], value: NodeSetType.supervisor },
        { label: NodeSetTypeMap[NodeSetType.role], value: NodeSetType.role },
        { label: NodeSetTypeMap[NodeSetType.initiatorSelected], value: NodeSetType.initiatorSelected },
        { label: NodeSetTypeMap[NodeSetType.initiatorThemselves], value: NodeSetType.initiatorThemselves },
        { label: NodeSetTypeMap[NodeSetType.multiLevelSupervisors], value: NodeSetType.multiLevelSupervisors },
        { label: NodeSetTypeMap[NodeSetType.department], value: NodeSetType.department },
        { label: NodeSetTypeMap[NodeSetType.designatedCandidate], value: NodeSetType.designatedCandidate },
      ]}
      {...props}
    />
  )
}

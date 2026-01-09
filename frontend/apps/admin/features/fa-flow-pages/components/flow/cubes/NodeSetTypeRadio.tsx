import React from 'react';
import { Radio, RadioProps, Select } from "antd";
import { FlwEnums } from "@features/fa-flow-pages/types";

const {NodeSetType, NodeSetTypeMap} = FlwEnums;

export interface NodeSetTypeRadioProps extends RadioProps {
}

/**
 * @author xu.pengfei
 * @date 2025/8/20 21:36
 */
export default function NodeSetTypeRadio({...props}: NodeSetTypeRadioProps) {
  return (
    <Radio.Group
      options={[
        { label: NodeSetTypeMap[NodeSetType.specifyMembers], value: NodeSetType.specifyMembers },
        { label: NodeSetTypeMap[NodeSetType.supervisor], value: NodeSetType.supervisor },
        { label: NodeSetTypeMap[NodeSetType.role], value: NodeSetType.role },
        { label: NodeSetTypeMap[NodeSetType.initiatorSelected], value: NodeSetType.initiatorSelected },
        { label: NodeSetTypeMap[NodeSetType.initiatorThemselves], value: NodeSetType.initiatorThemselves },
        { label: NodeSetTypeMap[NodeSetType.multiLevelSupervisors], value: NodeSetType.multiLevelSupervisors },
        { label: NodeSetTypeMap[NodeSetType.department], value: NodeSetType.department },
        { label: NodeSetTypeMap[NodeSetType.designatedCandidate], value: NodeSetType.designatedCandidate },
        { label: NodeSetTypeMap[NodeSetType.code], value: NodeSetType.code },
      ]}
      className='fa-grid3'
      {...props}
    />
  )
}

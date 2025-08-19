import React from 'react';
import { Flow } from "@features/fa-flow-pages/types";


export interface BranchProps {
  /** 流程配置节点Node JSON */
  node: Flow.Node;
}

/**
 * @author xu.pengfei
 * @date 2025/8/19 22:19
 */
export default function Branch({ node }: BranchProps) {
  return (
    <div></div>
  )
}

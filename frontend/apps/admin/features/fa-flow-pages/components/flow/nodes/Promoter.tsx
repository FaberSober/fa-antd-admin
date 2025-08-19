import React from 'react';
import { Flow } from "@features/fa-flow-pages/types";


export interface PromoterProps {
  /** 流程配置节点Node JSON */
  node: Flow.Node;
}

/**
 * @author xu.pengfei
 * @date 2025/8/19 20:22
 */
export default function Promoter({ node }: PromoterProps) {
  return (
    <div>
      启动节点
    </div>
  )
}

import { Flw } from '@/types';
import React, { useMemo } from 'react';

/**
 * @author xu.pengfei
 * @date 2026-01-15 16:03:17
 */
export default function useNodeAssigneeText(node: Flw.Node) {
  const text = useMemo(() => {
    if (node.nodeAssigneeList && node.nodeAssigneeList.length > 0) {
      return node.nodeAssigneeList.map(item => item.name).join("、")
    } else {
      return "所有人"
    }
  }, [node])

  return text;
}

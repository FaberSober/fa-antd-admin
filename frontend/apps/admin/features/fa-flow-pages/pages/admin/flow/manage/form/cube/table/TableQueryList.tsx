import React from 'react';
import { useFlowFormEditStore } from '../../store/useFlowFormEditStore';

export interface TableQueryListProps {
}

/**
 * @author xu.pengfei
 * @date 2025-12-20 19:51:10
 */
export default function TableQueryList({}: TableQueryListProps) {
  const { flowForm, setFlowForm } = useFlowFormEditStore()

  return (
    <div></div>
  );
}

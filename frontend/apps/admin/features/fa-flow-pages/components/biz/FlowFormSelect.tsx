import React from 'react';
import { BaseSelect, BaseSelectProps } from '@fa/ui';
import { Flow, Rbac } from '@/types';
import { flowFormApi as api } from '@/services';

/**
 * @author xu.pengfei
 * @date 2025-12-18 11:20:12
 */
export default function FlowFormSelect({ ...props }: Omit<BaseSelectProps<Flow.FlowForm>, 'serviceApi'>) {
  return <BaseSelect serviceApi={api} placeholder="请选择表单" {...props} />;
}

import React from 'react';
import { BaseSelect, BaseSelectProps } from '@fa/ui';
import { Flow } from '@/types';
import { flowProcessApi as api } from '@/services';

/**
 * @author xu.pengfei
 * @date 2025-12-18 11:20:12
 */
export default function FlowProcessSelect({ ...props }: Omit<BaseSelectProps<Flow.FlowProcess>, 'serviceApi'>) {
  return <BaseSelect serviceApi={api} placeholder="请选择流程" labelKey="processName" {...props} />;
}

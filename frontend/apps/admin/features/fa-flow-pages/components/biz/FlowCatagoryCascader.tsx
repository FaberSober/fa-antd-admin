import React from 'react';
import { BaseCascader, type BaseCascaderProps } from '@fa/ui';
import { Flow } from "@features/fa-flow-pages/types";
import { flowCatagoryApi } from "@features/fa-flow-pages/services";

export interface FlowCatagoryCascadereProps extends Omit<BaseCascaderProps<Flow.FlowCatagory, string>, 'serviceApi'> {}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function FlowCatagoryCascader(props: FlowCatagoryCascadereProps) {
  return <BaseCascader showRoot={false} serviceApi={flowCatagoryApi} placeholder="请选择流程分类" {...props} />;
}

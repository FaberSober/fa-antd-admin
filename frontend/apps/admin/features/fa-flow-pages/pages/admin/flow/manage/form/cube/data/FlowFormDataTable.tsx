import { flowFormApi } from '@/services';
import { Flow } from '@/types';
import { useTableQueryParams } from '@fa/ui';
import React, { useEffect, useState } from 'react';

export interface FlowFormDataTableProps {
  flowForm: Flow.FlowForm;
}

/**
 * @author xu.pengfei
 * @date 2025-12-19 14:27:05
 */
export default function FlowFormDataTable({ flowForm }: FlowFormDataTableProps) {

  const {queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, dicts, paginationProps} =
    useTableQueryParams<any>(flowFormApi.pageFormData, { flowFormId: flowForm.id }, `FlowForm_${flowForm.no}`);

  return (
    <div>

    </div>
  );
}

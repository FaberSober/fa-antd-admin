import { flowFormApi } from '@/services';
import { Flow } from '@/types';
import React, { useEffect, useState } from 'react';
import { each, get, isNil, set } from 'lodash';
import { FaUtils, PageLoading } from '@fa/ui';
import FaFormShow from './FaFormShow';
import { FormInstance } from 'antd';
import { getTableKeyMap } from './utils';

export interface FaFlowFormProps<T = any> {
  formId: number;
  form: FormInstance<any>;
  record?: T;
  onSuccess?: (record: T) => void;
  onLoadingChange?: (loading: boolean) => void;
  disabled?: boolean;
}

/**
 * @author xu.pengfei
 * @date 2025-12-18 11:28:43
 */
export default function FaFlowForm({ formId, form, record, onLoadingChange, onSuccess, disabled }: FaFlowFormProps) {
  const [flowForm, setFlowForm] = useState<Flow.FlowForm>();

  useEffect(() => {
    form.setFieldsValue(getInitialValues())
  }, [record, flowForm]);

  useEffect(() => {
    flowFormApi.getById(formId).then((res) => {
      setFlowForm(res.data);
    });
  }, [formId]);

  function getInitialValues() {
    const initValues = {
      ...(record||{}),
    }
    const mainTableMap = getTableKeyMap(flowForm?.dataConfig?.main)
    // console.log('mainTableMap', mainTableMap)
    if (flowForm && flowForm.config) {
      each(flowForm.config.formItems, (fi) => {
        // console.log('fi', fi)
        const col = mainTableMap[fi.name!]
        if (isNil(col)) return;
        if (col.dataType === 'datetime') {
          set(initValues, fi.name!, FaUtils.getDateFullStr(record[fi.name!]))
        }
      })
    }
    console.log('initValues', initValues)
    return initValues
  }

  /** 新增Item */
  function invokeInsertTask(params: any) {
    onLoadingChange?.(true);
    flowFormApi.saveFormData({
      formId,
      formData: params,
      childFormDataList: [],
    }).then((res) => {
      // FaUtils.showResponse(res, '新增DEMO-请假流程');
      if (onSuccess) onSuccess(res.data);
    }).finally(() => {
      onLoadingChange?.(false);
    })
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    onLoadingChange?.(true);
    // api.update(params.id, params).then((res) => {
    //   // FaUtils.showResponse(res, '更新DEMO-请假流程');
    //   if (onSuccess) onSuccess(res.data);
    // }).finally(() => {
    //   onLoadingChange?.(false);
    // })
  }

  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      applyDate: FaUtils.getDateStr000(fieldsValue.applyDate),
      // leaveStartTime: FaUtils.getDateStr000(fieldsValue.leaveStartTime, 'YYYY-MM-DD HH:mm:00'),
      // leaveEndTime: FaUtils.getDateStr000(fieldsValue.leaveEndTime, 'YYYY-MM-DD HH:mm:00'),
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  if (isNil(flowForm)) return <PageLoading />;
  return (
    <div>
      <FaFormShow
        config={flowForm.config}
        form={form}
        onFinish={onFinish}
        disabled={disabled}
      />
    </div>
  );
}

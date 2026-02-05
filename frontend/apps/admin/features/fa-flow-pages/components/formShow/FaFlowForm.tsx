import { flowFormApi } from '@/services';
import { Flow, Flw } from '@/types';
import React, { useEffect, useState } from 'react';
import { each, get, isNil, set } from 'lodash';
import { FaUtils, PageLoading } from '@fa/ui';
import FaFormShow from './FaFormShow';
import { FormInstance } from 'antd';
import { getTableKeyMap } from './utils';

export interface FaFlowFormProps<T = any> {
  formId: any;
  form: FormInstance<any>;
  flowNode?: Flw.Node;
  record?: T;
  onSuccess?: (record: T) => void;
  onLoadingChange?: (loading: boolean) => void;
  disabled?: boolean;
}

/**
 * @author xu.pengfei
 * @date 2025-12-18 11:28:43
 */
export default function FaFlowForm({ formId, form, flowNode, record, onLoadingChange, onSuccess, disabled }: FaFlowFormProps) {
  const [flowForm, setFlowForm] = useState<Flow.FlowForm>();

  useEffect(() => {
    if (record && flowForm) {
      form.setFieldsValue(getInitialValues())
    }
  }, [record, flowForm]);

  useEffect(() => {
    if (formId) {
      flowFormApi.getById(formId).then((res) => {
        setFlowForm(res.data);
      });
    }
  }, [formId]);

  function getInitialValues() {
    const initValues = {
      ...(record||{}),
    }
    const mainTableMap = getTableKeyMap(flowForm?.dataConfig?.main)
    // console.log('mainTableMap', mainTableMap)
    if (flowForm && flowForm.config) {
      each(flowForm.config.items, (fi) => {
        // console.log('fi', fi)
        const col = mainTableMap[fi.name!]
        if (isNil(col)) return;
        if (col.dataType === 'datetime') {
          set(initValues, fi.name!, FaUtils.getInitialKeyTimeValue(initValues, fi.name!))
        }
      })
    }
    console.log('initValues', initValues)
    return initValues
  }

  /** 新增Item */
  function invokeInsertTask(params: any) {
    // onLoadingChange?.(true);
    onSuccess?.({
      '_formId': formId,
      ...params,
    })
    // flowFormApi.saveFormData({
    //   formId,
    //   formData: params,
    //   // childFormDataList: [],
    // }).then((res) => {
    //   // FaUtils.showResponse(res, '新增流程');
    //   const {formId, formData} = res.data;
    //   if (onSuccess) onSuccess({
    //     '_formId': formId,
    //     ...formData,
    //     // childFormDataList,
    //   });
    // }).finally(() => {
    //   onLoadingChange?.(false);
    // })
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    onLoadingChange?.(true);
    // api.update(params.id, params).then((res) => {
    //   // FaUtils.showResponse(res, '更新流程');
    //   if (onSuccess) onSuccess(res.data);
    // }).finally(() => {
    //   onLoadingChange?.(false);
    // })
  }

  function onFinish(fieldsValue: any) {
    const values = FaUtils.formatDateValues(fieldsValue);
    console.log('提交的values', values);
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  if (isNil(flowForm)) return <PageLoading />;
  return (
    <div className='fa-full-content'>
      {formId && (
        <FaFormShow
          config={flowForm.config}
          flowNode={flowNode}
          form={form}
          onFinish={onFinish}
          disabled={disabled}
        />
      )}
    </div>
  );
}

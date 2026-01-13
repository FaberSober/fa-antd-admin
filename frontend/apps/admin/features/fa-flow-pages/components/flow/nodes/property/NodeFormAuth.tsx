import { Flow, Flw } from '@/types';
import React, { useEffect, useState } from 'react';
import './index.scss';
import { useWorkFlowStore } from '../../stores/useWorkFlowStore';
import { flowFormApi } from '@/services';
import { Checkbox } from 'antd';
import { FaFlexRestLayout, PageLoading, useApiLoading } from '@fa/ui';


export interface NodeFormAuthProps {
  node: Flw.Node;
  onChange?: (ec: Flw.NodeExtendConfig) => void;
}

/**
 * @author xu.pengfei
 * @date 2026-01-05 10:12:14
 */
export default function NodeFormAuth({ node, onChange }: NodeFormAuthProps) {
  const readOnly = useWorkFlowStore(state => state.readOnly);
  const flowProcess = useWorkFlowStore(state => state.flowProcess);
  const [flowForm, setFlowForm] = useState<Flow.FlowForm>();
  const [formItems, setFormItems] = useState<Flow.FlowFormItem[]>([]);

  const loading = useApiLoading(flowFormApi.getUrl(`getById/${flowProcess?.formId}`));

  useEffect(() => {
    if (!flowProcess || !flowProcess.id || !flowProcess.formId) return;
    // get dynamic form data
    flowFormApi.getById(flowProcess.formId).then(res => {
      setFlowForm(res.data);
      const formItems = res.data.config?.layout.map(l => {
        return res.data.config?.formItemMap[l.i];
      }).filter(fi => fi);
      setFormItems(formItems || []);
    })
  }, [flowProcess]);

  const formAuth = node.extendConfig?.formAuth || {};

  function processItemChecked(item: Flw.NodeExtendConfigFormAuth, perm: 'view' | 'edit' | 'required', checked: boolean) {
    // 如果不可见，则自动取消可编辑和必填
    if (perm === 'view' && !checked) {
      item.edit = false;
      item.required = false;
    }
    // 如果不可编辑，则自动取消必填
    if (perm === 'edit' && !checked) {
      item.required = false;
    }
    // 如果编辑，则自动可见
    if (perm === 'edit' && checked) {
      item.view = true;
    }
    // 如果必填，则自动可见和可编辑
    if (perm === 'required' && checked) {
      item.view = true;
      item.edit = true;
    }
  }

  function handleCheckAllChange(perm: 'view' | 'edit' | 'required', checked: boolean) {
    formItems.forEach(item => {
      if (!formAuth[item.id]) {
        formAuth[item.id] = {
          view: false,
          edit: false,
          required: false,
        };
      }
      formAuth[item.id][perm] = checked;
      processItemChecked(formAuth[item.id], perm, checked);
    });
    // update node extendConfig
    node.extendConfig = {
      ...node.extendConfig,
      formAuth,
    };
    console.log('Updated node extendConfig:', node.extendConfig);
    onChange && onChange(node.extendConfig!);
  }

  function handleCheckChange(itemId: string, perm: 'view' | 'edit' | 'required', checked: boolean) {
    if (!formAuth[itemId]) {
      formAuth[itemId] = {
        view: false,
        edit: false,
        required: false,
      };
    }
    formAuth[itemId][perm] = checked;
    processItemChecked(formAuth[itemId], perm, checked);
    // update node extendConfig
    node.extendConfig = {
      ...node.extendConfig,
      formAuth,
    };
    console.log('Updated node extendConfig:', node.extendConfig);
    onChange && onChange(node.extendConfig!);
  }

  // 全部查看
  let allViewChecked = formItems.length > 0 && formItems.every(item => formAuth[item.id]?.view);
  // 全部查看-半勾选
  let allViewIndeterminate = formItems.some(item => formAuth[item.id]?.view) && !allViewChecked;
  // 全部编辑
  let allEditChecked = formItems.length > 0 && formItems.every(item => formAuth[item.id]?.edit);
  // 全部编辑-半勾选
  let allEditIndeterminate = formItems.some(item => formAuth[item.id]?.edit) && !allEditChecked;
  // 全部必填
  let allRequiredChecked = formItems.length > 0 && formItems.every(item => formAuth[item.id]?.required);
  // 全部必填-半勾选
  let allRequiredIndeterminate = formItems.some(item => formAuth[item.id]?.required) && !allRequiredChecked;

  if (loading) return <PageLoading />;
  return (
    <div className='fa-flex-column fa-full'>
      <div className='fa-form-auth-header'>
        <div className='fa-form-auth-header-tr' style={{flex: 1}}>表单字段</div>
        <div className='fa-form-auth-header-tr' style={{width: 80}}>
          <Checkbox disabled={readOnly} onChange={e => handleCheckAllChange('view', e.target.checked)} indeterminate={allViewIndeterminate} checked={allViewChecked}>查看</Checkbox>
        </div>
        <div className='fa-form-auth-header-tr' style={{width: 80}}>
          <Checkbox disabled={readOnly} onChange={e => handleCheckAllChange('edit', e.target.checked)} indeterminate={allEditIndeterminate} checked={allEditChecked}>编辑</Checkbox>
        </div>
        <div className='fa-form-auth-header-tr' style={{width: 80}}>
          <Checkbox disabled={readOnly} onChange={e => handleCheckAllChange('required', e.target.checked)} indeterminate={allRequiredIndeterminate} checked={allRequiredChecked}>必填</Checkbox>
        </div>
      </div>
      <FaFlexRestLayout>
        {formItems.map(item => {
          const viewChecked = formAuth[item.id]?.view || false;
          const editChecked = formAuth[item.id]?.edit || false;
          const requiredChecked = formAuth[item.id]?.required || false;
          return (
            <div key={item.id} className='fa-form-auth-body-tr'>
              <div className='fa-form-auth-body-td' style={{flex: 1}}>
                {item.label}
              </div>
              <div className='fa-form-auth-body-td' style={{width: 80}}>
                <Checkbox disabled={readOnly} checked={viewChecked} onChange={e => handleCheckChange(item.id, 'view', e.target.checked)}>查看</Checkbox>
              </div>
              <div className='fa-form-auth-body-td' style={{width: 80}}>
                <Checkbox disabled={readOnly} checked={editChecked} onChange={e => handleCheckChange(item.id, 'edit', e.target.checked)}>编辑</Checkbox>
              </div>
              <div className='fa-form-auth-body-td' style={{width: 80}}>
                <Checkbox disabled={readOnly} checked={requiredChecked} onChange={e => handleCheckChange(item.id, 'required', e.target.checked)}>必填</Checkbox>
              </div>
          </div>
          )
        })}
      </FaFlexRestLayout>
    </div>
  );
}

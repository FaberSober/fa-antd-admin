import { Flow, Flw } from '@/types';
import React, { useEffect, useState } from 'react';
import './index.scss';
import { useWorkFlowStore } from '../../stores/useWorkFlowStore';
import { flowFormApi } from '@/services';
import { Checkbox } from 'antd';
import { FaFlexRestLayout } from '@fa/ui';


export interface NodeFormAuthProps {
  node: Flw.Node;
  onChange?: (ec: Flw.NodeExtendConfig) => void;
}

/**
 * @author xu.pengfei
 * @date 2026-01-05 10:12:14
 */
export default function NodeFormAuth({ node, onChange }: NodeFormAuthProps) {
  const flowProcess = useWorkFlowStore(state => state.flowProcess);
  const [flowForm, setFlowForm] = useState<Flow.FlowForm>();
  const [formItems, setFormItems] = useState<Flow.FlowFormItem[]>([]);

  useEffect(() => {
    if (!flowProcess || !flowProcess.id) return;
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
    // update node extendConfig
    node.extendConfig = {
      ...node.extendConfig,
      formAuth,
    };
    console.log('Updated node extendConfig:', node.extendConfig);
    onChange && onChange(node.extendConfig!);
  }

  return (
    <div className='fa-flex-column fa-full'>
      <div className='fa-form-auth-header'>
        <div className='fa-form-auth-header-tr' style={{flex: 1}}>表单字段</div>
        <div className='fa-form-auth-header-tr' style={{width: 80}}>
          <Checkbox onChange={e => handleCheckAllChange('view', e.target.checked)}>查看</Checkbox>
        </div>
        <div className='fa-form-auth-header-tr' style={{width: 80}}>
          <Checkbox onChange={e => handleCheckAllChange('edit', e.target.checked)}>编辑</Checkbox>
        </div>
        <div className='fa-form-auth-header-tr' style={{width: 80}}>
          <Checkbox onChange={e => handleCheckAllChange('required', e.target.checked)}>必填</Checkbox>
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
                <Checkbox checked={viewChecked} onChange={e => handleCheckChange(item.id, 'view', e.target.checked)}>查看</Checkbox>
              </div>
              <div className='fa-form-auth-body-td' style={{width: 80}}>
                <Checkbox checked={editChecked} onChange={e => handleCheckChange(item.id, 'edit', e.target.checked)}>编辑</Checkbox>
              </div>
              <div className='fa-form-auth-body-td' style={{width: 80}}>
                <Checkbox checked={requiredChecked} onChange={e => handleCheckChange(item.id, 'required', e.target.checked)}>必填</Checkbox>
              </div>
          </div>
          )
        })}
      </FaFlexRestLayout>
    </div>
  );
}

import { Flow, Flw } from '@/types';
import React, { useEffect, useState } from 'react';
import './index.scss';
import { useWorkFlowStore } from '../../stores/useWorkFlowStore';
import { flowFormApi } from '@/services';
import { Checkbox } from 'antd';

export interface NodeFormAuthProps {
  node: Flw.Node;
}

/**
 * @author xu.pengfei
 * @date 2026-01-05 10:12:14
 */
export default function NodeFormAuth({ node }: NodeFormAuthProps) {
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

  return (
    <div className='fa-flex-column'>
      <div className='fa-form-auth-header'>
        <div className='fa-form-auth-header-tr' style={{flex: 1}}>表单字段</div>
        <div className='fa-form-auth-header-tr' style={{width: 80}}>
          <Checkbox>查看</Checkbox>
        </div>
        <div className='fa-form-auth-header-tr' style={{width: 80}}>
          <Checkbox>编辑</Checkbox>
        </div>
        <div className='fa-form-auth-header-tr' style={{width: 80}}>
          <Checkbox>必填</Checkbox>
        </div>
      </div>
      {formItems.map(item => {
        return (
          <div key={item.id}>{item.label}</div>
        )
      })}
    </div>
  );
}

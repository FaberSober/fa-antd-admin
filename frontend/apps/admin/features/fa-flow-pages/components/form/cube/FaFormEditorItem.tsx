import { Flow } from '@/types';
import React from 'react';
import RowContainer from '../components/RowContainer';
import { DatePicker, Form, Input, Select } from 'antd';

export interface FaFormEditorItemProps {
  formItem: Flow.FlowFormItem;
  onClickRowItem?: (item: Flow.FlowFormItem) => void;
}

/**
 * @author xu.pengfei
 * @date 2025-12-18 09:49:58
 */
export default function FaFormEditorItem({ formItem, onClickRowItem }: FaFormEditorItemProps) {

  if (formItem.type === 'row') {
    return (<RowContainer row={formItem} onClickRowItem={onClickRowItem} />);
  }
  if (['input', 'select', 'datepicker', 'textarea'].includes(formItem.type)) {
    return (
      <Form.Item label={formItem.label || '输入框'} name={formItem.name}>
        {formItem.type === 'input' && <Input /> }
        {formItem.type === 'select' && <Select /> }
        {formItem.type === 'datepicker' && <DatePicker /> }
        {formItem.type === 'textarea' && <Input.TextArea rows={4} style={{ height: '100%', resize: 'none' }} /> }
      </Form.Item>
    )
  }
  return (
    <div className='fa-flex-1'>

    </div>
  );
}

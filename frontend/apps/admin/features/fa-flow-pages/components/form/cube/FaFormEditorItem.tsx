import { Flow } from '@/types';
import React from 'react';
import RowContainer from '../components/RowContainer';
import { Form, Input } from 'antd';

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
  if (formItem.type === 'input') {
    return (
      <Form.Item label={formItem.label || '输入框'} name={formItem.name}>
        <Input />
      </Form.Item>
    )
  }
  return (
    <div className='fa-flex-1'>

    </div>
  );
}

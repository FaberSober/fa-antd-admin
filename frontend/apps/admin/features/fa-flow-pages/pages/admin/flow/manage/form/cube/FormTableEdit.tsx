import { Flow } from '@features/fa-flow-pages/types';
import React from 'react';
import { FaFlexRestLayout } from '@fa/ui';
import FormTableCreateModal from './FormTableCreateModal';

export interface FormTableEditProps {
  item: Flow.FlowForm;
}

/**
 * @author xu.pengfei
 * @date 2025-12-16 19:50:11
 */
export default function FormTableEdit({ item }: FormTableEditProps) {

  const hasMainTable = item?.dataConfig?.main?.tableName;

  console.log('hasMainTable', hasMainTable);
  return (
    <div className='fa-full fa-flex-row'>
      <div style={{ width: 300 }} className='fa-border-r fa-p12'>
        <div>{item?.dataConfig?.main?.tableName}</div>
        {!hasMainTable && (<FormTableCreateModal addBtn title='新增主表' />)}
      </div>

      <FaFlexRestLayout>
        <div className='fa-p-16'>
          表结构编辑区
        </div>
      </FaFlexRestLayout>
    </div>
  );
}

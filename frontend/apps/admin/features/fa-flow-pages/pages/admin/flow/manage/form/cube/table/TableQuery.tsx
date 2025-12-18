import { Flow } from '@/types';
import { Table } from 'antd';
import { each } from 'lodash';
import React, { useMemo } from 'react';
import { useFlowFormEditStore } from '../../store/useFlowFormEditStore';

export interface TableQueryProps {
}

/**
 * @author xu.pengfei
 * @date 2025-12-18 21:00:01
 */
export default function TableQuery({ }: TableQueryProps) {
  const { flowForm, setFlowForm } = useFlowFormEditStore()

  const datasource = useMemo(() => {
    const fields: Flow.FlowFormDataConfigColumn[] = []
    if (flowForm && flowForm.dataConfig && flowForm.dataConfig.main && flowForm.dataConfig.main.columns) {
      each(flowForm.dataConfig.main.columns, col => {
        fields.push(col)
      })
    }
    return fields;
  }, [flowForm])

  console.log('TableQuery', 'flowForm', flowForm)
  return (
    <div className='fa-full fa-relative'>
      <Table
        rowKey='field'
        columns={[
          { dataIndex: 'comment', title: '名称' },
          { dataIndex: 'field', title: '查询字段' },
        ]}
        dataSource={datasource}
        size='small'
        rowSelection={{
          type: 'checkbox',
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          },
        }}
        pagination={false}
      />
    </div>
  );
}

import { Flow } from '@/types';
import { Table } from 'antd';
import { each, get, set } from 'lodash';
import React, { useMemo } from 'react';
import { useFlowFormEditStore } from '../../store/useFlowFormEditStore';

export interface TableQueryProps {
}

/**
 * @author xu.pengfei
 * @date 2025-12-18 21:00:01
 */
export default function TableQuery({ }: TableQueryProps) {
  const { flowForm, updateFlowFormTableConfig } = useFlowFormEditStore()

  const datasource = useMemo(() => {
    const fields: Flow.FlowFormDataConfigColumn[] = []
    if (flowForm && flowForm.dataConfig && flowForm.dataConfig.main && flowForm.dataConfig.main.columns) {
      each(flowForm.dataConfig.main.columns, col => {
        fields.push(col)
      })
    }
    return fields;
  }, [flowForm])

  const selectedRowKeys = useMemo(() => {
    console.log('TableQuery flowForm changed', flowForm)
    const keys: string[] = []
    const queryColumns = get(flowForm, 'tableConfig.query.columns', []);
    each(queryColumns, col => {
      keys.push(col.field)
    })
    return keys;
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
          selectedRowKeys: selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            if (!flowForm) return;
            const queryColumns: Flow.TableConfigQueryColumn[] = selectedRows.map((item, index) => {
              return {
                field: item.field,
                label: item.comment||item.field,
                queryType: 'like',
                default: '',
                multiple: false,
                sort: index
              }
            })
            set(flowForm, 'tableConfig.query.columns', queryColumns)
            updateFlowFormTableConfig({ ...flowForm })
          },
        }}
        pagination={false}
      />
    </div>
  );
}

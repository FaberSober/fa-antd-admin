import { Flow } from '@/types';
import { Table } from 'antd';
import { each, get, set } from 'lodash';
import React, { useMemo } from 'react';
import { useFlowFormEditStore } from '../../store/useFlowFormEditStore';

export interface TableColumnProps {
}

/**
 * @author xu.pengfei
 * @date 2025-12-21 10:54:47
 */
export default function TableColumn({ }: TableColumnProps) {
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
    console.log('TableColumn flowForm changed', flowForm)
    const keys: string[] = []
    const tableColumns = get(flowForm, 'tableConfig.table.columns', []);
    each(tableColumns, col => {
      keys.push(col.filed)
    })
    return keys;
  }, [flowForm])

  console.log('TableColumn', 'flowForm', flowForm)
  return (
    <div className='fa-full fa-relative'>
      <Table
        rowKey='field'
        columns={[
          { dataIndex: 'comment', title: '名称' },
          { dataIndex: 'field', title: '字段名' },
        ]}
        dataSource={datasource}
        size='small'
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            if (!flowForm) return;
            const tableColumns: Flow.TableConfiTableColumn[] = selectedRows.map((item, index) => {
              return {
                filed: item.field,
                label: item.comment||item.field,
                sorter: false,
                fix: 'none',
                width: 100,
                sort: index
              }
            })
            set(flowForm, 'tableConfig.table.columns', tableColumns)
            updateFlowFormTableConfig({ ...flowForm })
          },
        }}
        pagination={false}
      />
    </div>
  );
}

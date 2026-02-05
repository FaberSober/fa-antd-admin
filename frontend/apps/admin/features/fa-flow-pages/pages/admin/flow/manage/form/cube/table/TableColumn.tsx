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
        fields.push({ ...col, table: flowForm.dataConfig.main.tableName })
      })
      const tailFields = ['flow_instance_id', 'tenant_id', 'crt_time', 'crt_user', 'upd_time', 'upd_user', 'deleted'];
      fields.sort((a, b) => {
        const indexA = tailFields.indexOf(a.field);
        const indexB = tailFields.indexOf(b.field);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return -1;
        if (indexB === -1) return 1;
        return indexA - indexB;
      });
    }
    return fields;
  }, [flowForm])

  const selectedRowKeys = useMemo(() => {
    console.log('TableColumn flowForm changed', flowForm)
    const keys: string[] = []
    const tableColumns = get(flowForm, 'tableConfig.table.columns', []);
    each(tableColumns, col => {
      keys.push(col.field)
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
            const tableColumns: Flow.TableConfigTableColumn[] = selectedRows.map((item, index) => {
              return {
                table: item.table,
                field: item.field,
                dataType: item.dataType,
                label: item.comment||item.field,
                sorter: false,
                fix: 'none',
                width: undefined,
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

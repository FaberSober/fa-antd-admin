import React, { useMemo } from 'react';
import { useFlowFormEditStore } from '../../store/useFlowFormEditStore';
import { FaSortList } from '@fa/ui';
import FormTableColumnEdit from './FormTableColumnEdit';
import { get, set } from 'lodash';
import { Flow } from '@/types';

export interface TableColumnListProps {
}

/**
 * @author xu.pengfei
 * @date 2025-12-21 11:05:20
 */
export default function TableColumnList({}: TableColumnListProps) {
  const { flowForm, updateFlowFormTableConfig } = useFlowFormEditStore()

  const columns = useMemo(() => get(flowForm, 'tableConfig.table.columns', []), [flowForm])

  return (
    <div>
      {/* header */}
      <div className='fa-flex-row-center fa-gap6' style={{ fontSize: 14, fontWeight: 'bold', padding: '8px 4px', borderBottom: '1px solid #ccc' }}>
        <div style={{ width: 120 }}>列名</div>
        <div style={{ flex: 1 }}>字段</div>
        <div style={{ width: 100, textAlign: 'center' }}>排序</div>
        <div style={{ width: 100 }}>固定位置</div>
        <div style={{ width: 100 }}>宽度</div>
        <div style={{ width: 30 }}></div>
      </div>

      <FaSortList
        rowKey='field'
        list={columns}
        renderItem={(i) => (
          <FormTableColumnEdit
            column={i}
            // onSuccess={() => refresh()}
          />
        )}
        onSortEnd={l => {
          if (!flowForm) return;
          set(flowForm, 'tableConfig.table.columns', l)
          updateFlowFormTableConfig({ ...flowForm })
        }}
        itemStyle={{
          padding: 6,
          borderBottom: '1px solid var(--fa-border-color)',
        }}
        vertical
        handle
      />
    </div>
  );
}

import React, { useMemo } from 'react';
import { useFlowFormEditStore } from '../../store/useFlowFormEditStore';
import { FaSortList } from '@fa/ui';
import FormTableQueryColumnEdit from './FormTableQueryColumnEdit';
import { get, set } from 'lodash';
import { Flow } from '@/types';

export interface TableQueryListProps {
}

/**
 * @author xu.pengfei
 * @date 2025-12-20 19:51:10
 */
export default function TableQueryList({}: TableQueryListProps) {
  const { flowForm, updateFlowFormTableConfig } = useFlowFormEditStore()

  const columns = useMemo(() => get(flowForm, 'tableConfig.query.columns', []), [flowForm])

  return (
    <div>
      {/* header */}
      <div className='fa-flex-row-center fa-gap6' style={{ fontSize: 14, fontWeight: 'bold', padding: '8px 4px', borderBottom: '1px solid #ccc' }}>
        <div style={{ width: 120 }}>列名</div>
        <div style={{ flex: 1 }}>字段</div>
        <div style={{ width: 120 }}>类型</div>
        <div style={{ width: 120 }}>默认值</div>
        <div style={{ width: 120, textAlign: 'center' }}>是否多选</div>
        <div style={{ width: 30 }}></div>
      </div>

      <FaSortList
        rowKey='field'
        list={columns}
        renderItem={(i) => (
          <FormTableQueryColumnEdit
            column={i}
            // onSuccess={() => refresh()}
          />
        )}
        onSortEnd={l => {
          if (!flowForm) return;
          set(flowForm, 'tableConfig.query.columns', l)
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

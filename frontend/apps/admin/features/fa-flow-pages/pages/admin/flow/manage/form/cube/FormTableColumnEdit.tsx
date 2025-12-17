import { Flow } from '@/types';
import { Checkbox, Input } from 'antd';
import React from 'react';


const SYSTEM_FIELDS = ['id', 'crt_time', 'crt_user', 'upd_time', 'upd_user', 'deleted'];

export interface FormTableColumnEditProps {
  column: Flow.TableColumnVo
}

/**
 * @author xu.pengfei
 * @date 2025-12-17 16:34:38
 */
export default function FormTableColumnEdit({ column }: FormTableColumnEditProps) {

  const isSystemField = SYSTEM_FIELDS.includes(column.field);

  const isPk = column.key === 'PRI';
  return (
    <div className='fa-flex-1 fa-flex-row-center fa-gap6' style={{  }}>
      <div style={{ width: 120 }}>
        {isSystemField ? <span style={{ color: 'rgba(200, 0, 0, 1)' }}>{column.field}</span> : (
          <Input variant="filled" value={column.field} disabled={isPk} />
        )}
      </div>
      <div style={{ width: 120 }}>{column.dataType}</div>
      <div style={{ width: 80 }}>{column.length}</div>
      <div style={{ width: 80 }}>{column.precision}</div>
      <div style={{ width: 80 }}>{column.scale}</div>
      <div style={{ width: 40 }}>
        <Checkbox checked={isPk || column.nullable === 'YES'} disabled={isPk} />
      </div>
      <div style={{ width: 200 }}>
        {column.defaultValue}
      </div>
      <div style={{ width: 40 }}>
        <Checkbox checked={column.key === 'PRI'} />
      </div>
      <div style={{ width: 40 }}>
        <Checkbox checked={column.extra === 'auto_increment'} />
      </div>
      <div style={{ flex: 1 }}>{column.comment}</div>
      <div style={{ width: 30 }}>
        {!isSystemField && (
          <a style={{color: 'red'}}>删除</a>
        )}
      </div>
    </div>
  );
}

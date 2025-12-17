import { Flow } from '@/types';
import { FaFlexRestLayout, FaSortList } from '@fa/ui';
import { set } from 'lodash';
import React, { useEffect, useState } from 'react';
import FormTableColumnEdit from './FormTableColumnEdit';
import FormTableColumnAdd from './FormTableColumnAdd';
import { flowFormApi } from '@/services';


export interface FormTableColumnTableProps {
  tableInfo: Flow.TableInfoVo;
}

/**
 * @author xu.pengfei
 * @date 2025-12-17 16:14:30
 */
export default function FormTableColumnTable({ tableInfo }: FormTableColumnTableProps) {
  const [tableInfoClone, setTableInfoClone] = useState(tableInfo);

  useEffect(() => {
    console.log('tableInfo changed', tableInfo);
    setTableInfoClone(tableInfo);
  }, [tableInfo]);

  function updateColumnList(newList: Flow.TableColumnVo[]) {
    console.log('updateColumnList', newList);
    setTableInfoClone(prev => {
      const newInfo = { ...prev };
      set(newInfo, 'columns', newList);
      return newInfo;
    });
  }

  function refresh() {
    flowFormApi.queryTableStructure({ tableName: tableInfo.tableName }).then(res => {
      setTableInfoClone(res.data);
    });
  }

  return (
    <div className='fa-flex-column fa-full'>
      {/* header */}
      <div className='fa-flex-row-center fa-gap6' style={{ fontSize: 14, fontWeight: 'bold', padding: '8px 4px', borderBottom: '1px solid #ccc' }}>
        <div style={{ width: 120 }}>字段名</div>
        <div style={{ width: 120 }}>纯类型</div>
        <div style={{ width: 80 }}>长度</div>
        <div style={{ width: 80 }}>精度</div>
        <div style={{ width: 80 }}>小数</div>
        <div style={{ width: 40 }}>非空</div>
        <div style={{ width: 200 }}>默认值</div>
        <div style={{ width: 40 }}>主键</div>
        <div style={{ width: 40 }}>自增</div>
        <div style={{ flex: 1 }}>注释</div>
        <div style={{ width: 30 }}></div>
      </div>

      <FaFlexRestLayout>
        <FaSortList
          rowKey='field'
          list={tableInfoClone.columns}
          renderItem={(i) => (<FormTableColumnEdit column={i} />)}
          onSortEnd={l => updateColumnList(l)}
          itemStyle={{
            padding: 4,
            borderBottom: '1px solid var(--fa-border-color)',
          }}
          containerStyle={{

          }}
          vertical
          handle
        />
        <FormTableColumnAdd
          tableName={tableInfo.tableName}
          onSuccess={() => refresh()}
        />
      </FaFlexRestLayout>
    </div>
  );
}

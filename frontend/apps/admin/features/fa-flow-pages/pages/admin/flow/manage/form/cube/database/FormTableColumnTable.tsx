import { flowFormApi } from '@/services';
import { Flow } from '@/types';
import { FaFlexRestLayout, FaSortList, useApiLoading } from '@fa/ui';
import { Button, Space, Spin } from 'antd';
import { isNil, set } from 'lodash';
import { useEffect, useState } from 'react';
import FormTableColumnAdd from './FormTableColumnAdd';
import FormTableColumnEdit from './FormTableColumnEdit';
import { resortColumnsByConfig } from '../utils';


export interface FormTableColumnTableProps {
  item: Flow.FlowForm;
  tableInfo: Flow.TableInfoVo;
  onColumnsChange?: (columns: Flow.FlowFormDataConfigColumn[]) => void;
}

/**
 * @author xu.pengfei
 * @date 2025-12-17 16:14:30
 */
export default function FormTableColumnTable({ item, tableInfo, onColumnsChange }: FormTableColumnTableProps) {
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
    const columns: Flow.FlowFormDataConfigColumn[] = newList.map((col, index) => ({
      ...col,
      table: tableInfo.tableName,
      sort: index,
    }));
    onColumnsChange?.(columns);
  }

  function refresh(callback?: (columns: Flow.FlowFormDataConfigColumn[]) => void) {
    flowFormApi.queryTableStructure({ tableName: tableInfo.tableName }).then(res => {
      resortColumnsByConfig(res.data.columns, item.dataConfig);
      setTableInfoClone(res.data);
      const columns: Flow.FlowFormDataConfigColumn[] = res.data.columns.map((col, index) => ({
        ...col,
        table: tableInfo.tableName,
        sort: index,
      }));
      callback?.(columns);
    });
  }

  const loading = useApiLoading(flowFormApi.getUrl('queryTableStructure'));
  return (
    <div className='fa-flex-column fa-full'>
      <Space className='fa-mb12'>
        <Button onClick={() => refresh()}>刷新</Button>
        <Button 
          type="primary"
          onClick={() => {
            // 同步：将数据库表结构同步到配置中（不保持排序）
            refresh((columns) => {
              onColumnsChange?.(columns);
            });
          }}
        >
          同步
        </Button>
      </Space>
      {/* header */}
      <div className='fa-flex-row-center fa-gap6' style={{ fontSize: 14, fontWeight: 'bold', padding: '8px 4px', borderBottom: '1px solid #ccc' }}>
        <div style={{ width: 120 }}>字段名</div>
        <div style={{ width: 120 }}>纯类型</div>
        <div style={{ width: 80 }}>长度</div>
        <div style={{ width: 80 }}>精度</div>
        <div style={{ width: 80 }}>小数</div>
        <div style={{ width: 40, textAlign: 'center' }}>非空</div>
        <div style={{ width: 200 }}>默认值</div>
        <div style={{ width: 40, textAlign: 'center' }}>主键</div>
        <div style={{ width: 40, textAlign: 'center' }}>自增</div>
        <div style={{ flex: 1 }}>注释</div>
        <div style={{ width: 30 }}></div>
      </div>

      <FaFlexRestLayout>
        <Spin spinning={loading} style={{ flex: 1 }}>
          <FaSortList
            rowKey='field'
            list={tableInfoClone.columns}
            renderItem={(i) => (
              <FormTableColumnEdit
                column={i}
                tableName={tableInfo.tableName}
                onSuccess={() => refresh()}
              />
            )}
            onSortEnd={l => updateColumnList(l)}
            itemStyle={{
              padding: 6,
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
        </Spin>
      </FaFlexRestLayout>
    </div>
  );
}

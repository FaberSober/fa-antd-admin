import { Flow } from '@features/fa-flow-pages/types';
import React, { useEffect, useState } from 'react';
import { FaFlexRestLayout } from '@fa/ui';
import FormTableCreateModal from './FormTableCreateModal';
import { flowFormApi } from '@features/fa-flow-pages/services';
import { set } from 'lodash';
import FormTableColumnTable from './FormTableColumnTable';
import { Empty } from 'antd';
import { resortColumnsByConfig } from './utils';

export interface FormTableEditProps {
  item: Flow.FlowForm;
}

/**
 * @author xu.pengfei
 * @date 2025-12-16 19:50:11
 */
export default function FormTableEdit({ item }: FormTableEditProps) {

  const [itemClone, setItemClone] = useState(item);
  const [tableName, setTableName] = useState<string>();
  const [tableInfo, setTableInfo] = useState<Flow.TableInfoVo>();
  const [isMainTableCreated, setIsMainTableCreated] = useState<boolean>(false);

  useEffect(() => {
    setItemClone(item);
    if (itemClone?.dataConfig?.main?.tableName) {
      setIsMainTableCreated(true);
    }
  }, [item]);

  const hasMainTable = itemClone?.dataConfig?.main?.tableName;

  function handleCreateMainTableFinish(v: {tableName: string, comment: string}) {
    console.log('create table finish', v);
    setItemClone(prev => {
      const newItem = { ...prev };
      set(newItem, 'dataConfig.main.tableName', v.tableName);
      set(newItem, 'dataConfig.main.comment', v.comment);
      return newItem;
    });
    flowFormApi.update(item.id, {
      tableName: v.tableName,
      dataConfig: {
        ...item.dataConfig,
        main: {
          tableName: v.tableName,
          comment: v.comment,
        }
      }
    })
  }

  function handleColumnsChange(columns: Flow.FlowFormDataConfigColumn[]) {
    console.log('handleColumnsChange', columns);
    setItemClone(prev => {
      const newItem = { ...prev };
      set(newItem, 'dataConfig.main.columns', columns);
      return newItem;
    });
    flowFormApi.update(item.id, {
      dataConfig: {
        ...item.dataConfig,
        main: {
          ...item.dataConfig?.main,
          columns,
        }
      }
    })
  }

  // console.log('hasMainTable', hasMainTable);
  return (
    <div className='fa-full fa-flex-row'>
      <div style={{ width: 300 }} className='fa-border-r fa-p12'>
        {hasMainTable && (
          <div className='fa-normal-btn'
            onClick={() =>{
              const clickTableName = itemClone?.dataConfig?.main?.tableName;
              if (clickTableName === tableName) {
                return;
              }
              setTableName(itemClone?.dataConfig?.main?.tableName);
              flowFormApi.queryTableStructure({ tableName: clickTableName! }).then(res => {
                resortColumnsByConfig(res.data.columns, item.dataConfig);
                setTableInfo(res.data);
                if (!res.data.exist) {
                  setIsMainTableCreated(false);
                }
              });
            }}
          >{itemClone?.dataConfig?.main?.tableName}</div>
        )}
        {!isMainTableCreated && (
          <FormTableCreateModal
            addBtn
            title='新增主表'
            fetchFinish={handleCreateMainTableFinish}
          />
        )}
      </div>

      <FaFlexRestLayout>
        <div className='fa-p-16 fa-full'>
          {tableInfo && tableInfo.exist ? (
            <FormTableColumnTable item={itemClone} tableInfo={tableInfo} onColumnsChange={handleColumnsChange} />
          ) : <Empty description="表不存在" />}
        </div>
      </FaFlexRestLayout>
    </div>
  );
}

import { Flow } from '@features/fa-flow-pages/types';
import React, { useEffect, useState } from 'react';
import { BaseDrawer, FaFlexRestLayout } from '@fa/ui';
import FormTableCreateModal from './FormTableCreateModal';
import { flowFormApi } from '@features/fa-flow-pages/services';
import { set } from 'lodash';
import FormTableColumnTable from './FormTableColumnTable';
import { Button, Empty, Space } from 'antd';
import { resortColumnsByConfig } from '../utils';
import './FormTableEdit.scss';
import clsx from 'clsx';
import FormTableSelectModal from './FormTableSelectModal';
import FormTableLink from './FormTableLink';

export interface FormTableEditProps {
  item: Flow.FlowForm;
}

/**
 * @author xu.pengfei
 * @date 2025-12-16 19:50:11
 */
export default function FormTableEdit({ item }: FormTableEditProps) {

  const [itemClone, setItemClone] = useState(item);
  const [tableName, setTableName] = useState<string>(); // 选中查看的表
  const [tableInfo, setTableInfo] = useState<Flow.TableInfoVo>(); // 选中表详细
  const [isMainTableCreated, setIsMainTableCreated] = useState<boolean>(false);

  useEffect(() => {
    setItemClone(item);
    if (itemClone?.dataConfig?.main?.tableName) {
      setIsMainTableCreated(true);
      handleSelTable(itemClone?.dataConfig?.main?.tableName)
    }
  }, [item]);

  const hasMainTable = itemClone?.dataConfig?.main?.tableName;

  async function handleSetMainTable(v: {tableName: string, comment: string}) {
    console.log('create table finish', v);

    const res1 = await flowFormApi.queryTableStructure({ tableName: v.tableName });
    const columns: Flow.FlowFormDataConfigColumn[] = res1.data.columns.map((col, index) => ({
      ...col,
      table: v.tableName,
      sort: index,
    }));

    setItemClone(prev => {
      const newItem = { ...prev };
      set(newItem, 'dataConfig.main.tableName', v.tableName);
      set(newItem, 'dataConfig.main.comment', v.comment);
      set(newItem, 'dataConfig.main.columns', columns);
      set(newItem, 'dataConfig.main.pkField', res1.data.pkField);
      return newItem;
    });

    flowFormApi.update(item.id, {
      tableName: v.tableName,
      dataConfig: {
        ...item.dataConfig,
        main: {
          tableName: v.tableName,
          comment: v.comment,
          columns,
          pkField: res1.data.pkField,
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

  function handleSelTable(selTableName: string) {
    if (selTableName === tableName) {
      return;
    }
    setTableName(selTableName);
    flowFormApi.queryTableStructure({ tableName: selTableName! }).then(res => {
      resortColumnsByConfig(res.data.columns, item.dataConfig);
      setTableInfo(res.data);
      if (!res.data.exist) {
        setIsMainTableCreated(false);
      }
    });
  }

  function handleGetLinkTables() {
    
  }

  // console.log('hasMainTable', hasMainTable);
  return (
    <div className='fa-full fa-flex-row fa-gap12'>
      <div style={{ width: 250 }} className='fa-card'>
        {hasMainTable && (
          <div className={clsx('fa-form-table-item', tableName === itemClone?.dataConfig?.main?.tableName ? 'fa-form-table-item-active' : '')}
            onClick={() => handleSelTable(itemClone?.dataConfig?.main?.tableName)}
          >
            <div className="i-material-symbols:table fa-form-item-icon"/>
            <span>{itemClone?.dataConfig?.main?.tableName}</span>
          </div>
        )}
        <Space className='fa-mt12'>
          {!isMainTableCreated && (
            <FormTableCreateModal
              addBtn
              title='新增主表'
              fetchFinish={handleSetMainTable}
            />
          )}
          <FormTableSelectModal fetchFinish={handleSetMainTable}>
            <Button>关联主表</Button>
          </FormTableSelectModal>
          <BaseDrawer triggerDom={<Button>关联子表</Button>} size={800}>
            <FormTableLink item={itemClone} onRefresh={handleGetLinkTables} />
          </BaseDrawer>
          {/* <Button>新增子表</Button> */}
          {/* <Button>关联子表</Button> */}
        </Space>
      </div>

      <FaFlexRestLayout className="fa-full-content fa-card">
        <div className='fa-p-16 fa-full'>
          {tableInfo && tableInfo.exist ? (
            <FormTableColumnTable item={itemClone} tableInfo={tableInfo} onColumnsChange={handleColumnsChange} />
          ) : <Empty description="表不存在" />}
        </div>
      </FaFlexRestLayout>
    </div>
  );
}

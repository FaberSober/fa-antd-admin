import { Flow } from '@features/fa-flow-pages/types';
import React, { useEffect, useState } from 'react';
import { BaseDrawer, FaFlexRestLayout } from '@fa/ui';
import FormTableCreateModal from './FormTableCreateModal';
import { flowFormApi, flowFormTableApi } from '@features/fa-flow-pages/services';
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
  const [linkTables, setLinkTables] = useState<Flow.FlowFormTable[]>([]); // 关联子表列表

  useEffect(() => {
    setItemClone(item);
    if (itemClone?.dataConfig?.main?.tableName) {
      setIsMainTableCreated(true);
      handleSelTable(itemClone?.dataConfig?.main?.tableName)
    }
    // 加载关联子表列表
    handleGetLinkTables();
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
    console.log('handleColumnsChange', columns, 'tableName', tableName);
    
    // 判断当前选中的是主表还是子表
    const isMainTable = tableName === itemClone?.dataConfig?.main?.tableName;
    
    if (isMainTable) {
      // 更新主表配置
      if (!tableInfo) return;
      
      const updatedMainConfig: Flow.FlowFormDataConfigTable = {
        tableName: tableInfo.tableName,
        pkField: tableInfo.pkField,
        comment: tableInfo.tableComment || item.dataConfig?.main?.comment || '',
        columns,
      };
      
      setItemClone(prev => {
        const newItem = { ...prev };
        set(newItem, 'dataConfig.main', updatedMainConfig);
        return newItem;
      });
      
      flowFormApi.update(item.id, {
        dataConfig: {
          ...item.dataConfig,
          main: updatedMainConfig,
        }
      });
    } else {
      // 更新子表配置
      const linkTable = linkTables.find(t => t.tableName === tableName);
      if (!linkTable || !tableInfo) return;
      
      const updatedDataConfig: Flow.FlowFormDataConfigTable = {
        tableName: tableInfo.tableName,
        pkField: tableInfo.pkField,
        comment: tableInfo.tableComment || linkTable.dataConfig?.comment || '',
        columns,
      };
      
      // 更新本地状态
      setLinkTables(prev => prev.map(t => 
        t.id === linkTable.id 
          ? { ...t, dataConfig: updatedDataConfig }
          : t
      ));
      
      // 更新服务器数据
      flowFormTableApi.update(linkTable.id, {
        ...linkTable,
        dataConfig: updatedDataConfig,
      });
    }
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
    if (!item?.id) return;
    
    flowFormTableApi.list({ query: { flowFormId: item.id }, sorter: "sort asc" })
      .then((res) => {
        setLinkTables(res.data || []);
      });
  }

  // console.log('hasMainTable', hasMainTable);
  return (
    <div className='fa-full fa-flex-row fa-gap12'>
      <div style={{ width: 250 }} className='fa-card'>
        <Space className='fa-mb12'>
          <FormTableSelectModal fetchFinish={handleSetMainTable}>
            <Button>关联主表</Button>
          </FormTableSelectModal>
          <BaseDrawer triggerDom={<Button>关联子表</Button>} size={1200}>
            <FormTableLink item={itemClone} onRefresh={handleGetLinkTables} />
          </BaseDrawer>
          {/* 展示关联子表list */}
        </Space>

        <div className="fa-mb8" style={{ fontSize: 12, color: '#999' }}>主表</div>
        {hasMainTable && (
          <div className={clsx('fa-form-table-item', tableName === itemClone?.dataConfig?.main?.tableName ? 'fa-form-table-item-active' : '')}
            onClick={() => handleSelTable(itemClone?.dataConfig?.main?.tableName)}
          >
            <div className="i-material-symbols:table fa-form-item-icon"/>
            <span>{itemClone?.dataConfig?.main?.tableName}</span>
          </div>
        )}
        
        {/* 关联子表列表 */}
        {linkTables.length > 0 && (
          <div className="fa-mt12">
            <div className="fa-mb8" style={{ fontSize: 12, color: '#999' }}>关联子表</div>
            {linkTables.map((linkTable) => (
              <div
                key={linkTable.id}
                className={clsx('fa-form-table-item', tableName === linkTable.tableName ? 'fa-form-table-item-active' : '')}
                onClick={() => handleSelTable(linkTable.tableName)}
              >
                <div className="i-material-symbols:table-rows fa-form-item-icon" />
                <span>{linkTable.tableName}</span>
              </div>
            ))}
          </div>
        )}
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

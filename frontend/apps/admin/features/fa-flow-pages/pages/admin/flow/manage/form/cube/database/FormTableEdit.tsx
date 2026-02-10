import { Flow } from '@features/fa-flow-pages/types';
import React, { useEffect, useState } from 'react';
import { BaseDrawer, FaFlexRestLayout } from '@fa/ui';
import { flowFormApi, flowFormTableApi } from '@features/fa-flow-pages/services';
import { set } from 'lodash';
import FormTableColumnTable from './FormTableColumnTable';
import { Button, Empty, Space } from 'antd';
import { resortColumnsByConfig } from '../utils';
import './FormTableEdit.scss';
import clsx from 'clsx';
import FormTableSelectModal from './FormTableSelectModal';
import FormTableLink from './FormTableLink';
import { useFlowFormEditStore } from '../../store/useFlowFormEditStore';

export interface FormTableEditProps {
}

/**
 * @author xu.pengfei
 * @date 2025-12-16 19:50:11
 */
export default function FormTableEdit({ }: FormTableEditProps) {

  const { flowForm, updateFlowFormDataConfig, clear } = useFlowFormEditStore()
  
  const [tableName, setTableName] = useState<string>(); // 选中查看的表
  const [tableInfo, setTableInfo] = useState<Flow.TableInfoVo>(); // 选中表详细
  const [isMainTableCreated, setIsMainTableCreated] = useState<boolean>(false);
  const [linkTables, setLinkTables] = useState<Flow.FlowFormTable[]>([]); // 关联子表列表

  useEffect(() => {
    if (flowForm?.dataConfig?.main?.tableName) {
      setIsMainTableCreated(true);
      handleSelTable(flowForm?.dataConfig?.main?.tableName)
    }
    // 加载关联子表列表
    handleGetLinkTables();
  }, [flowForm]);

  const hasMainTable = flowForm?.dataConfig?.main?.tableName;

  async function handleSetMainTable(v: {tableName: string, comment: string}) {
    console.log('create table finish', v);
    if (!flowForm) return;

    const res1 = await flowFormApi.queryTableStructure({ tableName: v.tableName });
    const columns: Flow.FlowFormDataConfigColumn[] = res1.data.columns.map((col, index) => ({
      ...col,
      table: v.tableName,
      sort: index,
    }));

    const newDataConfig = { ...flowForm?.dataConfig };
    set(newDataConfig, 'main.tableName', v.tableName);
    set(newDataConfig, 'main.comment', v.comment);
    set(newDataConfig, 'main.columns', columns);
    set(newDataConfig, 'main.pkField', res1.data.pkField);
    updateFlowFormDataConfig(newDataConfig)

    flowFormApi.update(flowForm.id, {
      tableName: v.tableName,
      dataConfig: {
        ...flowForm.dataConfig,
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
    if (!flowForm) return;
    
    // 判断当前选中的是主表还是子表
    const isMainTable = tableName === flowForm?.dataConfig?.main?.tableName;
    
    if (isMainTable) {
      // 更新主表配置
      if (!tableInfo) return;
      
      const updatedMainConfig: Flow.FlowFormDataConfigTable = {
        tableName: tableInfo.tableName,
        pkField: tableInfo.pkField,
        comment: tableInfo.tableComment || flowForm.dataConfig?.main?.comment || '',
        columns,
      };
      const newDataConfig = { ...flowForm?.dataConfig };
      set(newDataConfig, 'main', updatedMainConfig);
      updateFlowFormDataConfig(newDataConfig);
      
      flowFormApi.update(flowForm.id, {
        dataConfig: {
          ...flowForm.dataConfig,
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
      resortColumnsByConfig(res.data.columns, flowForm?.dataConfig);
      setTableInfo(res.data);
      if (!res.data.exist) {
        setIsMainTableCreated(false);
      }
    });
  }

  function handleGetLinkTables() {
    if (!flowForm?.id) return;
    
    flowFormTableApi.list({ query: { flowFormId: flowForm.id }, sorter: "sort asc" })
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
            {flowForm && <FormTableLink item={flowForm} onRefresh={handleGetLinkTables} />}
          </BaseDrawer>
          {/* 展示关联子表list */}
        </Space>

        <div className="fa-mb8" style={{ fontSize: 12, color: '#999' }}>主表</div>
        {hasMainTable && (
          <div className={clsx('fa-form-table-item', tableName === flowForm?.dataConfig?.main?.tableName ? 'fa-form-table-item-active' : '')}
            onClick={() => handleSelTable(flowForm?.dataConfig?.main?.tableName)}
          >
            <div className="i-material-symbols:table fa-form-item-icon"/>
            <span>{flowForm?.dataConfig?.main?.tableName}</span>
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
          {flowForm && tableInfo && tableInfo.exist ? (
            <FormTableColumnTable item={flowForm} tableInfo={tableInfo} onColumnsChange={handleColumnsChange} />
          ) : <Empty description="表不存在" />}
        </div>
      </FaFlexRestLayout>
    </div>
  );
}

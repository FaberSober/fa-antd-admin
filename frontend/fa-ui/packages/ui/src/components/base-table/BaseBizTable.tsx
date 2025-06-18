import React, { useEffect, useState } from 'react';
import {find, get, isNumber, sumBy} from 'lodash';
import { ClearOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Table } from 'antd';
import type FaberTable from './FaberTable';
import { showResponse } from '@ui/utils/utils';
import { dataIndexToString, useScrollY } from './utils';
import ComplexQuery from '@ui/components/condition-query/ComplexQuery';
import type { TableRowSelection } from 'antd/es/table/interface';
import { v4 } from 'uuid';
import TableColConfigModal from '../modal/TableColConfigModal';
import { FaFlexRestLayout } from "@ui/components/base-layout";


/**
 * 基础业务表格组件
 * 1. 带字段自定义配置展示功能
 */
export default function BaseBizTable<RecordType extends object = any>({
  showTableColConfigBtn = true,
  showComplexQuery = true,
  showCheckbox = true,
  showTopDiv = true,
  showRowNum = false,
  biz = '',
  columns,
  refreshList,
  batchDelete,
  renderQuerySuffix = () => null,
  renderQueryAll = () => null,
  querySuffix = null,
  renderCheckBtns = () => null,
  onSceneChange = () => {},
  onConditionChange = () => {},
  rowSelection,
  rowClickSelected,
  rowClickSingleSelected = true,
  onSelectedRowsChange,
  showBatchDelBtn = true,
  keyName = 'id',
  batchDelBtn,
  showDeleteByQuery = false,
  onDeleteByQuery = () => {},
  ...props
}: FaberTable.BaseTableProps<RecordType>) {
  const [id] = useState(v4());
  const [innerScrollY] = useScrollY(id);

  const [config, setConfig] = useState<FaberTable.ColumnsProp<RecordType>[]>();

  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [batchDeleting, setBatchDeleting] = useState(false);

  useEffect(() => {
    setSelectedRowKeys([]);
  }, [get(props, 'pagination.total'), get(props, 'pagination.current'), get(props, 'pagination.pageSize')]);

  /**
   * 解析表格自定义配置
   * @return { parseColumns, scrollWidthX }
   * parseColumns 解析用户配置解析后的自定义字段配置
   * scrollWidthX 解析表格宽度
   */
  const processColumns = () => {
    // 表格字段配置
    // 解析自定义配置
    let parseColumns:FaberTable.ColumnsProp<RecordType>[] = [];
    if (config) {
      // 取自定义配置
      parseColumns = config.map((c) => {
        const col = find(columns, (d) => dataIndexToString(d.dataIndex) === dataIndexToString(c.dataIndex));
        let width = undefined
        if (c.width && isNumber(c.width) && c.width > 0) {
          width = Number(c.width)
        }
        return { ...col, ...c, width };
      });
    } else {
      // 取默认值
      parseColumns = columns.filter((c) => c.tcRequired || c.tcChecked);
    }

    if (showRowNum) {
      parseColumns = [
        {
          dataIndex: 'id',
          title: '序号',
          render: (_value:any, _record:any, index:any) => {
            // if (props.pagination) {
            //   const current = props.pagination.current || 1
            //   const pageSize = props.pagination.pageSize || 10
            //   return (current - 1) * pageSize + index + 1;
            // }
            return index + 1;
          },
          fixed: 'left',
          width: 80,
        },
        ...parseColumns,
      ]
    }

    // 计算table滚动width
    const scrollWidthX = sumBy(parseColumns, (n) => Number(n.width) || 200);

    return { parseColumns, scrollWidthX };
  };

  /** 表格配置变更 */
  function handleTableColConfigChange(tableColumns: FaberTable.ColumnsProp<RecordType>[]) {
    const c = tableColumns.filter((col) => col.tcRequired || col.tcChecked);
    setConfig(c);
  }

  /** 批量删除Item */
  function handleBatchDelete() {
    Modal.confirm({
      title: '删除',
      content: `确认删除勾选中的 ${selectedRowKeys.length} 条数据？`,
      okText: '删除',
      okType: 'danger',
      onOk: () => {
        if (batchDelete) {
          setBatchDeleting(true);
          return batchDelete(selectedRowKeys)
            .then((res) => {
              setBatchDeleting(false);
              showResponse(res, '批量删除');
              refreshList();
            })
            .catch(() => setBatchDeleting(false));
        }
      },
    });
  }

  const { parseColumns, scrollWidthX } = processColumns();

  const myRowSelection: TableRowSelection<RecordType> = {
    fixed: true,
    selectedRowKeys,
    onChange: (rowKeys) => {
      updateRowKeys(rowKeys);
    },
    ...rowSelection,
    // columnWidth: 30,
  };

  function updateRowKeys(rowKeys: any[]) {
    setSelectedRowKeys(rowKeys);
    if (onSelectedRowsChange) {
      onSelectedRowsChange(rowKeys);
    }
  }

  /**
   * delete all by current query condition
   */
  function handleDeleteQueryAll() {
    if (onDeleteByQuery) {
      onDeleteByQuery();
    }
  }

  return (
    <div style={{ flex: 1, position:'relative' }}>
      <div className="fa-flex-column fa-full-content">
        {showTopDiv && (
          <div>
            {/* 多选删除 */}
            {selectedRowKeys.length > 0 && (
              <Space style={{padding: 8, display: 'flex', lineHeight: '32px'}}>
                <div className="fa-text fa-mr12">
                  已选中&nbsp;<a>{selectedRowKeys.length}</a>&nbsp;条数据
                </div>
                {renderCheckBtns && renderCheckBtns(selectedRowKeys)}
                {showBatchDelBtn && (
                  <Button loading={batchDeleting} onClick={handleBatchDelete} icon={<DeleteOutlined/>} danger>
                    {batchDelBtn || '删除'}
                  </Button>
                )}
                <Button onClick={() => updateRowKeys([])} icon={<ClearOutlined/>}>
                  取消选中
                </Button>
              </Space>
            )}
            {/* 高级组合查询 */}
            {selectedRowKeys.length === 0 && (
              <div style={{padding: 8, display: 'flex', alignItems: 'center'}}>
                {showComplexQuery && (
                  <ComplexQuery
                    columns={columns}
                    biz={biz}
                    onSceneChange={onSceneChange}
                    onConditionChange={onConditionChange}
                  />
                )}
                <div className="fa-text" style={{flex: 1}}>
                  {renderQuerySuffix &&  renderQuerySuffix()}
                  {querySuffix}
                </div>
                <Space style={{marginRight: 8, display: 'flex', lineHeight: '32px'}}>
                  {renderQueryAll && renderQueryAll()}
                  {showDeleteByQuery && (
                    <Button danger onClick={() => handleDeleteQueryAll()} icon={<DeleteOutlined />}>
                      全部删除
                    </Button>
                  )}
                </Space>
                <div className="fa-text" style={{lineHeight: '32px'}}>
                  共<a style={{fontWeight: 600, margin: '0 4px'}}>{props.pagination ? get(props, 'pagination.total') : props.dataSource?.length}</a>条数据
                </div>
              </div>
            )}
          </div>
        )}

        <FaFlexRestLayout id={id}>
          <Table
            id={id}
            columns={parseColumns}
            rowSelection={showCheckbox ? myRowSelection : undefined}
            scroll={{x: scrollWidthX, y: innerScrollY}}
            onRow={(record) => ({
              onClick: () => {
                // 点击row选中功能实现
                if (!rowClickSelected) return;
                const clickId = get(record, 'id');
                let newRowKey = [];
                if (rowClickSingleSelected) {
                  newRowKey = [clickId];
                } else {
                  if (selectedRowKeys.indexOf(clickId) > -1) {
                    newRowKey = selectedRowKeys.filter((i) => i === clickId);
                  } else {
                    newRowKey = [...selectedRowKeys, get(record, keyName!)];
                  }
                }
                setSelectedRowKeys(newRowKey);
                if (onSelectedRowsChange) {
                  onSelectedRowsChange(newRowKey);
                }
              },
            })}
            size="small"
            showSorterTooltip={false}
            {...props}
          />
          {/* 表格自定义配置 */}
          {showTableColConfigBtn ? (
            <div style={{position: 'absolute', right: 4, top: 4, zIndex: 9}}>
              <TableColConfigModal columns={columns} biz={biz} onConfigChange={handleTableColConfigChange}>
                <Button icon={<SettingOutlined/>} type="text"/>
              </TableColConfigModal>
            </div>
          ) : null}
        </FaFlexRestLayout>
      </div>
    </div>
  );
}

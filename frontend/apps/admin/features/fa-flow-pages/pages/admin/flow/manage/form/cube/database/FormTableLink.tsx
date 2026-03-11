import { Flow } from '@/types';
import React, { useEffect, useState } from 'react';
import { Button, Table, Popconfirm, Empty, Input, Select, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { flowFormTableApi, flowFormApi } from '@/services';
import { FaUtils } from '@fa/ui';
import FormTableSelectModal from './FormTableSelectModal';
import { sortFieldsByTail } from '@features/fa-flow-pages/configs/form';

/** 表字段选择器组件 */
interface TableFieldSelectProps {
  value: string;
  tableName: string;
  onChange: (value: string) => void;
  getTableColumns: (tableName: string) => Promise<Flow.TableColumnVo[]>;
}

function TableFieldSelect({ value, tableName, onChange, getTableColumns }: TableFieldSelectProps) {
  const [columns, setColumns] = useState<Flow.TableColumnVo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tableName) {
      setLoading(true);
      getTableColumns(tableName)
        .then(setColumns)
        .finally(() => setLoading(false));
    }
  }, [tableName]);

  return (
    <Select
      value={value}
      style={{ width: '100%' }}
      showSearch
      optionFilterProp="label"
      loading={loading}
      onChange={onChange}
      options={columns.map(col => ({
        label: `${col.field} (${col.comment || col.type})`,
        value: col.field,
      }))}
    />
  );
}

export interface FormTableLinkProps {
  item: Flow.FlowForm;
  onRefresh?: () => void;
}

/**
 * 流程主表关联子表列表管理
 * @author xu.pengfei
 * @date 2026-01-31 13:21:11
 */
export default function FormTableLink({ item, onRefresh }: FormTableLinkProps) {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Flow.FlowFormTable[]>([]);
  const [tableColumnsCache, setTableColumnsCache] = useState<Record<string, Flow.TableColumnVo[]>>({});

  useEffect(() => {
    if (item?.id) {
      fetchList();
    }
  }, [item?.id]);

  /** 获取关联子表列表 */
  function fetchList() {
    if (!item?.id) return;
    
    setLoading(true);
    flowFormTableApi.list({ query: { flowFormId: item.id }, sorter: "sort asc" })
      .then((res) => {
        setList(res.data || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  /** 选择表后，直接创建关联子表记录 */
  function handleTableSelect(v: { tableName: string; comment: string }) {
    // 校验1：不能添加主表
    if (v.tableName === item.dataConfig?.main?.tableName) {
      message.error('不能添加主表作为关联子表');
      return;
    }

    // 校验2：不能重复添加
    const existingTable = list.find(t => t.tableName === v.tableName);
    if (existingTable) {
      message.error(`表 "${v.tableName}" 已存在，不能重复添加`);
      return;
    }

    const params = {
      flowFormId: item.id,
      tableName: v.tableName,
      sort: list.length,
      remark: v.comment,
      foreignKey: '', // 用户稍后在表格中选择
      referenceKey: '', // 用户稍后在表格中选择
    };

    flowFormTableApi.save(params).then((res) => {
      FaUtils.showResponse(res, '新增关联子表');
      fetchList();
      if (onRefresh) onRefresh();
    });
  }



  /** 删除关联子表 */
  function handleDelete(id: number) {
    flowFormTableApi.remove(id).then((res) => {
      FaUtils.showResponse(res, '删除关联子表');
      fetchList();
      if (onRefresh) onRefresh();
    });
  }

  /** 更新关联子表字段 */
  function handleUpdateField(id: number, field: 'foreignKey' | 'referenceKey' | 'sort' | 'remark', value: string | number) {
    const record = list.find(item => item.id === id);
    if (!record) return;

    flowFormTableApi.update(id, { ...record, [field]: value }).then((res) => {
      FaUtils.showResponse(res, '更新关联子表');
      fetchList();
      if (onRefresh) onRefresh();
    });
  }

  /** 获取表字段列表（带缓存） */
  async function getTableColumns(tableName: string): Promise<Flow.TableColumnVo[]> {
    if (tableColumnsCache[tableName]) {
      return tableColumnsCache[tableName];
    }

    const res = await flowFormApi.queryTableStructure({ tableName });
    const columns = res.data.columns || [];
    sortFieldsByTail(columns);
    setTableColumnsCache(prev => ({ ...prev, [tableName]: columns }));
    return columns;
  }

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      render: (value: number, record: Flow.FlowFormTable) => (
        <Input
          value={value}
          style={{ width: '100%' }}
          onBlur={(e) => {
            const newValue = parseInt(e.target.value, 10);
            if (!isNaN(newValue) && newValue !== value) {
              handleUpdateField(record.id, 'sort', newValue);
            }
          }}
          onChange={(e) => {
            // 实时更新显示，但不保存
            const newList = list.map(item => 
              item.id === record.id ? { ...item, sort: parseInt(e.target.value, 10) || 0 } : item
            );
            setList(newList);
          }}
        />
      ),
    },
    {
      title: '表名',
      dataIndex: 'tableName',
      width: 200,
    },
    {
      title: '外键字段',
      dataIndex: 'foreignKey',
      width: 200,
      render: (value: string, record: Flow.FlowFormTable) => (
        <TableFieldSelect
          value={value}
          tableName={record.tableName}
          onChange={(newValue) => handleUpdateField(record.id, 'foreignKey', newValue)}
          getTableColumns={getTableColumns}
        />
      ),
    },
    {
      title: '关联主键',
      dataIndex: 'referenceKey',
      width: 200,
      render: (value: string, record: Flow.FlowFormTable) => (
        <Select
          value={value}
          style={{ width: '100%' }}
          showSearch
          optionFilterProp="label"
          onChange={(newValue) => handleUpdateField(record.id, 'referenceKey', newValue)}
          options={item.dataConfig?.main?.columns?.map(col => ({
            label: `${col.field} (${col.comment || col.type})`,
            value: col.field,
          })) || []}
        />
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      render: (value: string, record: Flow.FlowFormTable) => (
        <Input
          value={value}
          style={{ width: '100%' }}
          placeholder="请输入备注"
          onBlur={(e) => {
            const newValue = e.target.value;
            if (newValue !== value) {
              handleUpdateField(record.id, 'remark', newValue);
            }
          }}
          onChange={(e) => {
            // 实时更新显示，但不保存
            const newList = list.map(item => 
              item.id === record.id ? { ...item, remark: e.target.value } : item
            );
            setList(newList);
          }}
        />
      ),
    },
    {
      title: '操作',
      dataIndex: 'opr',
      width: 80,
      fixed: 'right' as const,
      render: (_: any, record: Flow.FlowFormTable) => (
        <Popconfirm
          title="确认删除该关联子表？"
          onConfirm={() => handleDelete(record.id)}
          okText="确认"
          cancelText="取消"
        >
          <Button type="link" danger icon={<DeleteOutlined />} size="small">
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  if (!item?.id) {
    return <Empty description="请先选择流程表单" />;
  }

  return (
    <div className="fa-full-content fa-flex-column">
      <div className="fa-flex-row-center fa-p8">
        <div className="fa-h3">关联子表管理</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <FormTableSelectModal fetchFinish={handleTableSelect}>
            <Button type="primary">新增关联子表</Button>
          </FormTableSelectModal>
        </div>
      </div>

      <div className="fa-flex-1" style={{ padding: '0 8px 8px' }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          loading={loading}
          pagination={false}
          size="small"
          bordered
        />
      </div>
    </div>
  );
}

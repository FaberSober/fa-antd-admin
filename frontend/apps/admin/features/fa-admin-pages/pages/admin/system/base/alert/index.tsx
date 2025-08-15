import React from 'react';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import {
  AuthDelBtn,
  BaseBizTable,
  BaseBoolSelector,
  BaseTableUtils,
  clearForm,
  DictDataSelector,
  type FaberTable,
  useDelete,
  useExport,
  useTableQueryParams
} from '@fa/ui';
import { alertApi as api } from '@features/fa-admin-pages/services';
import type { Admin } from '@/types';
import AlertModal from './modal/AlertModal';
import AlertStatistic from "./cube/AlertStatistic";
import {dispatch} from 'use-bus'

const serviceName = '告警';
const biz = 'base_alert';

export default function AlertList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Admin.Alert>(api.page, {}, serviceName, {
      onAfterGetPage: () => {
        dispatch({ type: '@@api/refresh_alert_statistic' })
      },
    });

  const [handleDelete] = useDelete<number>(api.remove, fetchPageList, serviceName);
  const [exporting, fetchExportExcel] = useExport(api.exportExcel, queryParams);

  /** 生成表格列 */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIdColumn('ID', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('告警内容', 'content', undefined, sorter),
      BaseTableUtils.genSimpleSorterColumn('告警类型', 'type', 150, sorter),
      BaseTableUtils.genBoolSorterColumn('是否处理', 'deal', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('负责人', 'dutyStaff', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('处理人', 'dealStaff', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('处理时间', 'dealTime', 150, sorter),
      BaseTableUtils.genSimpleSorterColumn('处理描述', 'dealDesc', 300, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'menu',
        render: (_, r) => (
          <Space>
            <AlertModal editBtn title={`编辑${serviceName}信息`} record={r} fetchFinish={fetchPageList} />
            <AuthDelBtn handleDelete={() => handleDelete(r.id)} />
          </Space>
        ),
        width: 120,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Admin.Alert>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      {/* 统计卡片区域 */}
      <AlertStatistic />

      {/* 查询表单区域 */}
      <div style={{ padding: '0 12px 12px 12px', display: 'flex', justifyContent: 'flex-end' }}>
        <Form form={form} layout="inline" onFinish={setFormValues}>
          <Form.Item name="content" label="告警内容">
            <Input placeholder="请输入告警内容" allowClear />
          </Form.Item>
          <Form.Item name="type" label="告警类型">
            <DictDataSelector dictLabel="alert.type" placeholder="请选择告警类型" allowClear />
          </Form.Item>
          <Form.Item name="deal" label="是否处理">
            <BaseBoolSelector placeholder="请选择处理状态" allowClear />
          </Form.Item>

          <Space>
            <Button htmlType="submit" loading={loading} icon={<SearchOutlined />}>
              查询
            </Button>
            <Button onClick={() => clearForm(form)}>重置</Button>
            <AlertModal addBtn title={`新增${serviceName}信息`} fetchFinish={fetchPageList} />
            <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>
              导出
            </Button>
          </Space>
        </Form>
      </div>

      <BaseBizTable
        rowKey="id"
        biz={biz}
        columns={genColumns()}
        pagination={paginationProps}
        loading={loading}
        dataSource={list}
        onChange={handleTableChange}
        refreshList={() => fetchPageList()}
        batchDelete={(ids) => api.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
        style={{ flex: 1, margin: 0 }}
      />
    </div>
  );
}

import React from 'react';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import { AuthDelBtn, BaseBizTable, BaseDrawer, BaseTableUtils, clearForm, type FaberTable, useDelete, useExport, useTableQueryParams } from '@fa/ui';
import { systemUpdateLogApi as api } from '@features/fa-admin-pages/services';
import type { Admin } from '@/types';
import SystemUpdateLogView from '@features/fa-admin-pages/pages/admin/system/base/systemUpdateLog/cube/SystemUpdateLogView';
import FaHrefView from '@features/fa-admin-pages/components/icons/FaHrefView';

const serviceName = '系统版本更新日志';
const biz = 'base_system_update_log';

/**
 * BASE-系统版本更新日志表表格查询
 */
export default function SystemUpdateLogList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Admin.SystemUpdateLog>(api.page, {}, serviceName);

  const [handleDelete] = useDelete<number>(api.remove, fetchPageList, serviceName);
  const [exporting, fetchExportExcel] = useExport(api.exportExcel, queryParams);

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIdColumn('ID', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('模块编码', 'no', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('模块名称', 'name', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('版本号', 'ver', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('版本编码', 'verNo', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('备注信息', 'remark', undefined, sorter),
      // BaseTableUtils.genSimpleSorterColumn('SQL执行内容', 'log', 100, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'menu',
        render: (_, r) => (
          <Space>
            <BaseDrawer triggerDom={<FaHrefView />} width={1000}>
              <SystemUpdateLogView record={r} />
            </BaseDrawer>
            <AuthDelBtn handleDelete={() => handleDelete(r.id)} />
          </Space>
        ),
        width: 120,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Admin.SystemUpdateLog>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', padding: 8 }}>
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="no" label="模块编码">
              <Input placeholder="请输入模块编码" allowClear />
            </Form.Item>
            <Form.Item name="name" label="模块名称">
              <Input placeholder="请输入模块名称" allowClear />
            </Form.Item>
            <Form.Item name="ver" label="版本号">
              <Input placeholder="请输入版本号" allowClear />
            </Form.Item>
            <Form.Item name="verNo" label="版本编码">
              <Input placeholder="请输入版本编码" allowClear />
            </Form.Item>

            <Space>
              <Button htmlType="submit" loading={loading} icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={() => clearForm(form)}>重置</Button>
              <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>
                导出
              </Button>
            </Space>
          </Form>
        </div>
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
      />
    </div>
  );
}

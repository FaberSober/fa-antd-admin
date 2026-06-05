import React from 'react';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import {
  AuthDelBtn,
  BaseBizTable,
  BaseTableUtils,
  BaseBoolSelector,
  clearForm,
  type FaberTable,
  useDelete,
  useExport,
  useTableQueryParams,
} from '@fa/ui';
import type { Tn } from '@/types';
import { tenantApi } from '@features/fa-admin-pages/services';
import TenantModal from './modal/TenantModal';

const serviceName = '租户管理';
const biz = 'tn_tenant';

export default function TenantList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Tn.Tenant>(tenantApi.page, { sorter: { field: 'crtTime', order: 'descend' } }, serviceName);

  const [handleDelete] = useDelete<string>(tenantApi.remove, fetchPageList, serviceName);
  const [exporting, fetchExportExcel] = useExport(tenantApi.exportExcel, queryParams);

  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genSimpleSorterColumn('租户编码', 'code', 160, sorter),
      BaseTableUtils.genSimpleSorterColumn('租户名称', 'name', 180, sorter),
      BaseTableUtils.genSimpleSorterColumn('租户简称', 'shortName', 140, sorter),
      BaseTableUtils.genSimpleSorterColumn('联系人', 'contactName', 120, sorter),
      BaseTableUtils.genSimpleSorterColumn('联系电话', 'contactPhone', 140, sorter),
      BaseTableUtils.genSimpleSorterColumn('联系邮箱', 'contactEmail', 220, sorter),
      BaseTableUtils.genDateSorterColumn('到期时间', 'expireTime', 180, sorter),
      BaseTableUtils.genBoolSorterColumn('状态', 'status', 80, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, r: Tn.Tenant) => (
          <Space>
            <TenantModal editBtn title={`编辑${serviceName}`} record={r} fetchFinish={fetchPageList} />
            <AuthDelBtn handleDelete={() => handleDelete(r.id)} />
          </Space>
        ),
        width: 120,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Tn.Tenant>[];
  }

  return (
    <div className="fa-full-content-p12 fa-flex-column fa-content">
      <div className="fa-flex-row-center fa-p8 fa-search-form">
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="code" label="编码">
              <Input placeholder="请输入租户编码" allowClear />
            </Form.Item>
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入租户名称" allowClear />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <BaseBoolSelector />
            </Form.Item>
            <Space>
              <Button htmlType="submit" loading={loading} icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={() => clearForm(form)}>重置</Button>
              <TenantModal addBtn title={`新增${serviceName}`} fetchFinish={fetchPageList} />
              <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>
                导出
              </Button>
            </Space>
          </Form>
        </div>
      </div>

      <BaseBizTable
        biz={biz}
        rowKey="id"
        columns={genColumns()}
        pagination={paginationProps}
        loading={loading}
        dataSource={list}
        onChange={handleTableChange}
        refreshList={() => fetchPageList()}
        batchDelete={(ids) => tenantApi.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
      />
    </div>
  );
}

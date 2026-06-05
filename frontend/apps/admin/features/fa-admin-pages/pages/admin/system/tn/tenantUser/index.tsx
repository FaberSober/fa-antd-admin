import React from 'react';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Space } from 'antd';
import {
  AuthDelBtn,
  BaseBizTable,
  BaseBoolSelector,
  BaseTableUtils,
  clearForm,
  type FaberTable,
  useDelete,
  useExport,
  useTableQueryParams,
} from '@fa/ui';
import type { Tn } from '@/types';
import { tenantUserApi } from '@features/fa-admin-pages/services';
import { AllUserSearchSelect, TenantSearchSelect } from '@features/fa-admin-pages/components/helper';
import TenantUserModal from './modal/TenantUserModal';

const serviceName = '租户用户关联';
const biz = 'tn_tenant_user';

export default function TenantUserList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Tn.TenantUser>(tenantUserApi.page, { sorter: { field: 'crtTime', order: 'descend' } }, serviceName);

  const [handleDelete] = useDelete<string>(tenantUserApi.remove, fetchPageList, serviceName);
  const [exporting, fetchExportExcel] = useExport(tenantUserApi.exportExcel, queryParams);

  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genSimpleSorterColumn('租户名称', 'tenantName', 180, sorter),
      BaseTableUtils.genSimpleSorterColumn('用户名称', 'userName', 140, sorter),
      BaseTableUtils.genBoolSorterColumn('租户管理员', 'isAdmin', 100, sorter),
      BaseTableUtils.genBoolSorterColumn('状态', 'status', 80, sorter),
      BaseTableUtils.genSimpleSorterColumn('排序', 'sort', 80, sorter),
      BaseTableUtils.genSimpleSorterColumn('描述', 'description', 220, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, r: Tn.TenantUser) => (
          <Space>
            <TenantUserModal editBtn title={`编辑${serviceName}`} record={r} fetchFinish={fetchPageList} />
            <AuthDelBtn handleDelete={() => handleDelete(r.id)} />
          </Space>
        ),
        width: 120,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Tn.TenantUser>[];
  }

  return (
    <div className="fa-full-content-p12 fa-flex-column fa-content">
      <div className="fa-flex-row-center fa-p8 fa-search-form">
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="tenantId" label="租户">
              <TenantSearchSelect />
            </Form.Item>
            <Form.Item name="userId" label="用户">
              <AllUserSearchSelect />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <BaseBoolSelector />
            </Form.Item>
            <Space>
              <Button htmlType="submit" loading={loading} icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={() => clearForm(form)}>重置</Button>
              <TenantUserModal addBtn title={`新增${serviceName}`} fetchFinish={fetchPageList} />
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
        batchDelete={(ids) => tenantUserApi.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
      />
    </div>
  );
}

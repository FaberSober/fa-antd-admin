import React from 'react';
import { DownloadOutlined, SearchOutlined, UnorderedListOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import { AuthDelBtn, BaseBizTable, BaseDrawer, BaseTableUtils, clearForm, type FaberTable, FaHref, useDelete, useExport, useTableQueryParams } from '@fa/ui';
import type { Rbac } from '@/types';
import { rbacRoleApi } from '@features/fa-admin-pages/services';
import RbacRoleModal from './modal/RbacRoleModal';
import RbacRoleMenuDrawer from './modal/RbacRoleMenuDrawer';
import RbacUserRoleList from './list/RbacUserRoleList';

const serviceName = '';
const biz = 'base_rbac_role';

export default function RbacRoleList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Rbac.RbacRole>(rbacRoleApi.page, { sorter: { field: 'crtTime', order: 'descend' } }, serviceName);

  const [handleDelete] = useDelete<string>(rbacRoleApi.remove, fetchPageList, serviceName);
  const [exporting, fetchExportExcel] = useExport(rbacRoleApi.exportExcel, queryParams);

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genSimpleSorterColumn('角色名称', 'name', 200, sorter),
      BaseTableUtils.genSimpleSorterColumn('角色描述', 'remarks', undefined, sorter),
      BaseTableUtils.genBoolSorterColumn('是否启用', 'status', 100, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, record) => (
          <Space>
            <RbacRoleModal editBtn title={`编辑${serviceName}信息`} record={record} fetchFinish={fetchPageList} />
            <RbacRoleMenuDrawer record={record}>
              <FaHref icon={<UnorderedListOutlined />} text="权限" />
            </RbacRoleMenuDrawer>
            <BaseDrawer title="角色用户列表" triggerDom={<FaHref icon={<UsergroupAddOutlined />} text="用户" />}>
              <RbacUserRoleList rbacRole={record} />
            </BaseDrawer>
            <AuthDelBtn handleDelete={() => handleDelete(record.id)} />
          </Space>
        ),
        width: 230,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Rbac.RbacRole>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div className="fa-flex-row-center fa-p8">
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="name" label="角色名称">
              <Input placeholder="请输入角色名称" allowClear />
            </Form.Item>

            <Space>
              <Button htmlType="submit" loading={loading} icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={() => clearForm(form)}>重置</Button>
              <RbacRoleModal addBtn title={`新增${serviceName}信息`} fetchFinish={fetchPageList} />
              <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>
                导出
              </Button>
            </Space>
          </Form>
        </div>
      </div>

      <BaseBizTable
        biz={biz}
        columns={genColumns()}
        pagination={paginationProps}
        loading={loading}
        dataSource={list}
        rowKey={(item) => item.id}
        onChange={handleTableChange}
        refreshList={() => fetchPageList()}
        batchDelete={(ids) => rbacRoleApi.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
      />
    </div>
  );
}

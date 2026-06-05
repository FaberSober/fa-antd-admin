import React, { useContext } from 'react';
import { DownloadOutlined, SearchOutlined, UnorderedListOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Tag } from 'antd';
import { AuthDelBtn, BaseBizTable, BaseDrawer, BaseTableUtils, clearForm, type FaberTable, FaHref, useDelete, useExport, useTableQueryParams } from '@fa/ui';
import type { Rbac } from '@/types';
import { rbacRoleApi } from '@features/fa-admin-pages/services';
import UserLayoutContext from '@features/fa-admin-pages/layout/user/context/UserLayoutContext';
import RbacRoleModal from './modal/RbacRoleModal';
import RbacRoleMenuDrawer from './modal/RbacRoleMenuDrawer';
import RbacUserRoleList from './list/RbacUserRoleList';

const serviceName = '';
const biz = 'base_rbac_role';

const ROLE_TYPE_OPTIONS = [
  { value: 1, label: '全局超管', color: 'red' },
  { value: 2, label: '全局', color: 'blue' },
  { value: 3, label: '租户', color: 'green' },
] as const;

export default function RbacRoleList() {
  const [form] = Form.useForm();
  const { user, selectedTenant } = useContext(UserLayoutContext);

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Rbac.RbacRole>(rbacRoleApi.page, { sorter: { field: 'crtTime', order: 'descend' } }, serviceName);

  const [handleDelete] = useDelete<string>(rbacRoleApi.remove, fetchPageList, serviceName);
  const [exporting, fetchExportExcel] = useExport(rbacRoleApi.exportExcel, queryParams);

  function getRoleType(record: Rbac.RbacRole): 1 | 2 | 3 {
    if (record.type) return record.type;
    if (String(record.id) === '1') return 1;
    return record.tenantId ? 3 : 2;
  }

  function canManageRole(record: Rbac.RbacRole) {
    const type = getRoleType(record);
    if (user.superAdmin) return true;
    if (type === 1 || !selectedTenant?.isAdmin) return false;
    return type === 2 || record.tenantId === selectedTenant.tenantId;
  }

  function canCreateRole() {
    return user.superAdmin || selectedTenant?.isAdmin;
  }

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genSimpleSorterColumn('角色名称', 'name', 200, sorter),
      BaseTableUtils.genSimpleSorterColumn('角色描述', 'remarks', undefined, sorter),
      {
        title: '类型',
        dataIndex: 'type',
        render: (_, record) => {
          const option = ROLE_TYPE_OPTIONS.find((item) => item.value === getRoleType(record));
          return <Tag color={option?.color}>{option?.label}</Tag>;
        },
        width: 110,
      },
      {
        ...BaseTableUtils.genSimpleSorterColumn('租户名称', 'tenantId', 180, sorter),
        render: (_, record) => record.tenantName || record.tenantId || '-',
      },
      BaseTableUtils.genBoolSorterColumn('是否启用', 'status', 100, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, record) => (
          <Space>
            {canManageRole(record) && (
              <>
                <RbacRoleModal editBtn title={`编辑${serviceName}信息`} record={record} fetchFinish={fetchPageList} />
                <RbacRoleMenuDrawer record={record}>
                  <FaHref icon={<UnorderedListOutlined />} text="权限" />
                </RbacRoleMenuDrawer>
                <BaseDrawer title="角色用户列表" triggerDom={<FaHref icon={<UsergroupAddOutlined />} text="用户" />}>
                  <RbacUserRoleList rbacRole={record} />
                </BaseDrawer>
                <AuthDelBtn handleDelete={() => handleDelete(record.id)} />
              </>
            )}
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
    <div className="fa-full-content-p12 fa-flex-column fa-content">
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
              {canCreateRole() && <RbacRoleModal addBtn title={`新增${serviceName}信息`} fetchFinish={fetchPageList} />}
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
        dataSource={user.superAdmin ? list : list.filter((item) => getRoleType(item) !== 1)}
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

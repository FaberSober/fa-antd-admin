import React, { useContext } from 'react';
import {
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { Button, Card, Form, Input, Space } from 'antd';
import { ShiroPermissionContainer } from '@/components/auth';
import BaseBizTable, { BaseTableUtils, FaberTable } from '@/components/biz/base-table';
import { UserContext } from "@/layout/UserSimpleLayout";
import { useExport, useTableQueryParams, clearForm, useDelete } from "@/utils/myHooks";
import modelService from '@/services/rbac/rbacRole';
import Rbac from '@/props/rbac';
import RbacRoleModal from './modal/RbacRoleModal';
import {FaHref} from "@/components/biz/decorator";
import RbacRoleMenuDrawer from "@/pages/system/base/rbac/role/modal/RbacRoleMenuDrawer";

const serviceName = '角色';
const buzzModal = 'base_rbac_role';

export default function RbacRoleList() {
  const { user } = useContext(UserContext);
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Rbac.RbacRole>(modelService.page, { sorter: { field: 'crtTime', order: "descend" } }, serviceName)

  const [handleDelete] = useDelete<number>(modelService.remove, fetchPageList, serviceName)
  const [exporting, fetchExportExcel] = useExport(modelService.exportExcel, queryParams)

  /** 生成表格字段List */
  function genColumns():FaberTable.ColumnsProp<Rbac.RbacRole>[] {
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
            <ShiroPermissionContainer roleList={user.elements}>
              <RbacRoleModal title={`编辑${serviceName}信息`} record={record} fetchFinish={fetchPageList}>
                <FaHref icon={<EditOutlined />} text="编辑" />
              </RbacRoleModal>
            </ShiroPermissionContainer>
            <RbacRoleMenuDrawer record={record}>
              <FaHref icon={<UnorderedListOutlined />} text="权限" />
            </RbacRoleMenuDrawer>
            <FaHref icon={<UsergroupAddOutlined />} text="用户" />
            <BaseTableUtils.AuthDelBtn record={record} handleDelete={(r) => handleDelete(r.id)} elements={user.elements} permission={undefined} />
          </Space>
        ),
        width: 220,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ];
  }

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: 12 }}>
        <div style={{ display: 'flex' }}>
          <strong style={{ fontSize: '18px', marginLeft: 8 }}>{serviceName}</strong>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <div>
            <Form form={form} layout="inline" onFinish={setFormValues}>
              <Form.Item name="search" label="搜索">
                <Input placeholder="请输入搜索内容" />
              </Form.Item>
            </Form>
          </div>

          <div>
            <Space>
              <Button onClick={() => form.submit()} loading={loading} icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={() => clearForm(form)} loading={loading}>
                重置
              </Button>
              <ShiroPermissionContainer roleList={user.elements}>
                <RbacRoleModal title={`新增${serviceName}信息`} fetchFinish={fetchPageList} destroyOnClose={false}>
                  <Button icon={<PlusOutlined />} type="primary">
                    新增
                  </Button>
                </RbacRoleModal>
              </ShiroPermissionContainer>
              <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>导出</Button>
            </Space>
          </div>
        </div>
      </div>

      <BaseBizTable
        buzzModal={buzzModal}
        columns={genColumns()}
        pagination={paginationProps}
        loading={loading}
        dataSource={list}
        rowKey={(item) => item.id}
        onChange={handleTableChange}
        refreshList={() => fetchPageList()}
        batchDelete={(ids) => modelService.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
      />
    </Card>
  );
}

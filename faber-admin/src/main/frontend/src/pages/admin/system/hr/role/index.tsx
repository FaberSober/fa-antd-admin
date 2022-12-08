import React from 'react';
import {
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import {Button, Card, Form, Input, Space} from 'antd';
import BaseBizTable, {BaseTableUtils, FaberTable} from '@/components/base-table';
import {clearForm, useDelete, useExport, useTableQueryParams} from "@/utils/myHooks";
import modelService from '@/services/rbac/rbacRole';
import Rbac from '@/props/rbac';
import RbacRoleModal from './modal/RbacRoleModal';
import {AuthDelBtn, FaHref} from "@/components/decorator";
import RbacRoleMenuDrawer from "./modal/RbacRoleMenuDrawer";
import RbacRoleUserDrawer from "./modal/RbacRoleUserDrawer";

const serviceName = '角色';
const buzzModal = 'base_rbac_role';

export default function RbacRoleList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Rbac.RbacRole>(modelService.page, { sorter: { field: 'crtTime', order: "descend" } }, serviceName)

  const [handleDelete] = useDelete<string>(modelService.remove, fetchPageList, serviceName)
  const [exporting, fetchExportExcel] = useExport(modelService.exportExcel, queryParams)

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
            <RbacRoleModal title={`编辑${serviceName}信息`} record={record} fetchFinish={fetchPageList}>
              <FaHref icon={<EditOutlined />} text="编辑" />
            </RbacRoleModal>
            <RbacRoleMenuDrawer record={record}>
              <FaHref icon={<UnorderedListOutlined />} text="权限" />
            </RbacRoleMenuDrawer>
            <RbacRoleUserDrawer record={record}>
              <FaHref icon={<UsergroupAddOutlined />} text="用户" />
            </RbacRoleUserDrawer>
            <AuthDelBtn handleDelete={() => handleDelete(record.id)} />
          </Space>
        ),
        width: 220,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Rbac.RbacRole>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div className="fa-flex-row-center fa-p8">
        <strong style={{ fontSize: '18px' }}>{serviceName}</strong>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="name" label="角色名称">
              <Input placeholder="请输入角色名称" />
            </Form.Item>
          </Form>

          <Space>
            <Button onClick={() => form.submit()} loading={loading} icon={<SearchOutlined />}>查询</Button>
            <Button onClick={() => clearForm(form)} loading={loading}>重置</Button>
            <RbacRoleModal title={`新增${serviceName}信息`} fetchFinish={fetchPageList}>
              <Button icon={<PlusOutlined />} type="primary">新增</Button>
            </RbacRoleModal>
            <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>导出</Button>
          </Space>
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
    </div>
  );
}

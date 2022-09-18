import React, { useContext } from 'react';
import { RouteComponentProps } from '@reach/router';
import { DownloadOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space } from 'antd';
import { ShiroPermissionContainer } from '@/components/auth';
import BaseBizTable, { BaseTableUtils, FaberTable } from '@/components/biz/base-table';
import { UserContext } from '@/layout/UserSimpleLayout';
import modelService from '@/services/admin/department';
import Admin from '@/props/admin';
import DepartmentModal from './modal/DepartmentModal';
import { clearForm, useDelete, useExport, useTableQueryParams } from '@/utils/myHooks';

const serviceName = '部门';
const buzzModal = 'base_department_v1.1';

export default function DepartmentList(props: RouteComponentProps) {
  const { user } = useContext(UserContext);
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, dicts, paginationProps } =
    useTableQueryParams<Admin.DepartmentPageVo>(modelService.page, { sorter: { field: 'crtTime', order: 'descend' } }, serviceName);

  const [exporting, fetchExportExcel] = useExport(modelService.exportExcel, queryParams);
  const [handleDelete] = useDelete<string>(modelService.remove, fetchPageList, serviceName);

  /** 生成表格字段List */
  function genColumns(): FaberTable.ColumnsProp<Admin.DepartmentPageVo>[] {
    const { sorter } = queryParams;
    return [
      // BaseTableUtils.genSimpleSorterColumn('ID', 'id', 340, sorter, false),
      BaseTableUtils.genSimpleSorterColumn('部门名称', 'name', 300, sorter),
      // BaseTableUtils.genSimpleSorterColumn('父部门ID', 'parentId', 100, sorter),
      BaseTableUtils.genDictSorterColumn('类型', 'type', 100, sorter, dicts, 'common:department:type'),
      {
        ...BaseTableUtils.genSimpleSorterColumn('负责人', 'managerId', 120, sorter),
        render: (val, record) => record.manager?.name,
      },
      BaseTableUtils.genSimpleSorterColumn('排序', 'sort', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('备注', 'description', undefined, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, record) => (
          <Space>
            <ShiroPermissionContainer roleList={user.elements} permission="departmentManager:btn_edit">
              <DepartmentModal title={`编辑${serviceName}信息`} record={record} fetchFinish={fetchPageList}>
                <a>
                  <EditOutlined />
                  编辑
                </a>
              </DepartmentModal>
            </ShiroPermissionContainer>
            <BaseTableUtils.AuthDelBtn
              record={record}
              handleDelete={(r) => handleDelete(r.id)}
              elements={user.elements}
              permission="departmentManager:btn_del"
            />
          </Space>
        ),
        width: 120,
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
          <strong style={{ fontSize: '18px' }}>{serviceName}</strong>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form style={{ flex: 1, flexDirection: 'row-reverse' }} form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入部门名称" />
            </Form.Item>
          </Form>

          <div>
            <Space>
              <Button onClick={() => form.submit()} loading={loading} icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={() => clearForm(form)} loading={loading}>
                重置
              </Button>
              <ShiroPermissionContainer roleList={user.elements} permission="departmentManager:btn_add">
                <DepartmentModal title={`新增${serviceName}信息`} fetchFinish={fetchPageList} destroyOnClose={false}>
                  <Button icon={<PlusOutlined />} type="primary">
                    新增
                  </Button>
                </DepartmentModal>
              </ShiroPermissionContainer>
              <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>
                导出
              </Button>
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

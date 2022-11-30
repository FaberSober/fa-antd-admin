import React from 'react';
import { DownloadOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import {FaHref} from "@/components/decorator";
import { ShiroPermissionContainer } from '@/components/auth';
import BaseBizTable, { BaseTableUtils, FaberTable } from '@/components/base-table';
import { useExport, useTableQueryParams, clearForm, useDelete } from "@/utils/myHooks";
import modelService from '@/services/demo/student';
import Demo from '@/props/demo';
import StudentModal from './modal/StudentModal';

const serviceName = '学生表-表格查询示例';
const buzzModal = 'demo_student';

export default function StudentList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, dicts, paginationProps } =
    useTableQueryParams<Demo.Student>(modelService.page, {}, serviceName)

  const [handleDelete] = useDelete<number>(modelService.remove, fetchPageList, serviceName)
  const [exporting, fetchExportExcel] = useExport(modelService.exportExcel, queryParams)

  /** 生成表格字段List */
  function genColumns():FaberTable.ColumnsProp<Demo.Student>[] {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIdColumn('ID', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('学生名', 'name', 120, sorter),
      BaseTableUtils.genSimpleSorterColumn('年龄', 'age', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('性别', 'sex', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('邮箱', 'email', 200, sorter),
      BaseTableUtils.genDateSorterColumn('生日', 'birthday', 120, sorter),
      BaseTableUtils.genBoolSorterColumn('账户是否有效', 'valid', undefined, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, record) => (
          <Space>
            <ShiroPermissionContainer>
              <StudentModal title={`编辑${serviceName}信息`} record={record} fetchFinish={fetchPageList}>
                <FaHref icon={<EditOutlined />} text="编辑" />
              </StudentModal>
            </ShiroPermissionContainer>
            <BaseTableUtils.AuthDelBtn record={record} handleDelete={(r) => handleDelete(r.id)} />
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
    <div className="fa-full-content fa-bg-white">
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', padding: 8 }}>
        <div style={{ display: 'flex' }}>
          <strong style={{ fontSize: '18px', marginLeft: 8 }}>{serviceName}</strong>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <div>
            <Form form={form} layout="inline" onFinish={setFormValues}>
              <Form.Item name="name" label="姓名">
                <Input placeholder="请输入姓名" />
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
              <ShiroPermissionContainer>
                <StudentModal title={`新增${serviceName}信息`} fetchFinish={fetchPageList} destroyOnClose={false}>
                  <Button icon={<PlusOutlined />} type="primary">
                    新增
                  </Button>
                </StudentModal>
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
    </div>
  );
}

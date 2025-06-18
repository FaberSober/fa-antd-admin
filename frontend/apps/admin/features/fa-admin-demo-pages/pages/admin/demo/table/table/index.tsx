import React from 'react';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Tag } from 'antd';
import { isNil } from 'lodash';
import { AuthDelBtn, BaseBizTable, BaseTableUtils, clearForm, type FaberTable, useDelete, useExport, useTableQueryParams } from '@fa/ui';
import { studentApi } from '@/services';
import type { Demo } from '@/types';
import StudentModal from './modal/StudentModal';

const serviceName = '学生表-表格查询示例';
const biz = 'demo_student';

/**
 * Demo-学生表表格查询
 */
export default function DemoTableSimpleTable() {
  const [form] = Form.useForm();

  const {queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, dicts, paginationProps} =
    useTableQueryParams<Demo.Student>(studentApi.page, {}, serviceName);

  const [handleDelete] = useDelete<number>(studentApi.remove, fetchPageList, serviceName);
  const [exporting, fetchExportExcel] = useExport(studentApi.exportExcel, queryParams);

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIdColumn('ID', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('学生名', 'name', 110, sorter),
      BaseTableUtils.genSimpleSorterColumn('年龄', 'age', 60, sorter),
      BaseTableUtils.genEnumSorterColumn('性别', 'sex', 60, sorter, dicts),
      BaseTableUtils.genSimpleSorterColumn('邮箱', 'email', 150, sorter),
      BaseTableUtils.genDateSorterColumn('生日', 'birthday', 100, sorter),
      BaseTableUtils.genBoolSorterColumn('账户有效', 'valid', 100, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('标签', 'tags', undefined, sorter),
        render: (_, r) => {
          return (r.tags || []).map((t) => <Tag key={t.name}>{t.name}</Tag>);
        },
      },
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, r) => (
          <Space>
            <StudentModal editBtn title={`编辑${serviceName}信息`} record={r} fetchFinish={fetchPageList} />
            <AuthDelBtn handleDelete={() => handleDelete(r.id)} />
          </Space>
        ),
        width: 120,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Demo.Student>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div className="fa-flex-row-center fa-p8">
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="name" label="姓名">
              <Input placeholder="请输入姓名" allowClear />
            </Form.Item>

            <Space>
              <Button htmlType="submit" loading={loading} icon={<SearchOutlined />}>查询</Button>
              <Button onClick={() => clearForm(form)}>重置</Button>
              <StudentModal addBtn title={`新增${serviceName}信息`} fetchFinish={fetchPageList} />
              <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>导出</Button>
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
        batchDelete={(ids) => studentApi.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
        expandable={{
          expandedRowRender: (record: Demo.Student) => (
            <p style={{ margin: 0 }}>
              info1: {record.info.info1}, info2: {record.info.info2}
            </p>
          ),
          rowExpandable: (record: Demo.Student) => !isNil(record.info),
        }}
      />
    </div>
  );
}

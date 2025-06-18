import React from 'react';
import { DownloadOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import {
  AuthDelBtn,
  BaseBizTable,
  BaseTableUtils,
  DictEnumApiSelector,
  clearForm,
  type FaberTable,
  FaHref,
  useDelete,
  useExport,
  useTableQueryParams,
} from '@fa/ui';
import type { Admin } from '@/types';
import { areaApi } from '@features/fa-admin-pages/services';
import AreaModal from './modal/AreaModal';

const serviceName = '';
const biz = 'base_area';

export default function AreaList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, dicts, paginationProps } =
    useTableQueryParams<Admin.Area>(areaApi.page, { sorter: { field: 'areaCode', order: 'ascend' } }, serviceName);

  const [exporting, fetchExportExcel] = useExport(areaApi.exportExcel, queryParams);
  const [handleDelete] = useDelete<number>(areaApi.remove, fetchPageList, serviceName);

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      // BaseTableUtils.genSimpleSorterColumn('ID', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('名称', 'name', 150, sorter),
      BaseTableUtils.genEnumSorterColumn('层级', 'level', 70, sorter, dicts),
      BaseTableUtils.genSimpleSorterColumn('父级行政代码', 'parentCode', 150, sorter),
      BaseTableUtils.genSimpleSorterColumn('行政代码', 'areaCode', 150, sorter),
      BaseTableUtils.genSimpleSorterColumn('邮政编码', 'zipCode', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('区号', 'cityCode', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('简称', 'shortName', 150, sorter),
      BaseTableUtils.genSimpleSorterColumn('组合名', 'mergerName', 250, sorter),
      BaseTableUtils.genSimpleSorterColumn('拼音', 'pinyin', 150, sorter),
      BaseTableUtils.genSimpleSorterColumn('经度', 'lng', 120, sorter),
      BaseTableUtils.genSimpleSorterColumn('纬度', 'lat', 120, sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, record) => (
          <Space>
            <AreaModal title={`编辑${serviceName}信息`} record={record} fetchFinish={fetchPageList}>
              <FaHref icon={<EditOutlined />} text="编辑" />
            </AreaModal>
            <AuthDelBtn handleDelete={() => handleDelete(record.id)} />
          </Space>
        ),
        width: 120,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Admin.Area>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div className="fa-flex-row-center fa-p8">
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入名称" />
            </Form.Item>
            <Form.Item name="level" label="层级">
              <DictEnumApiSelector enumName="AreaLevelEnum" placeholder="请选择层级" />
            </Form.Item>

            <Space>
              <Button htmlType="submit" loading={loading} icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={() => clearForm(form)}>重置</Button>
              <AreaModal addBtn title={`新增${serviceName}信息`} fetchFinish={fetchPageList} />
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
        batchDelete={(ids) => areaApi.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
      />
    </div>
  );
}

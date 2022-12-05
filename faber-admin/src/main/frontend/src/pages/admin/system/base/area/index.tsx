import React from 'react';
import {DownloadOutlined, EditOutlined, PlusOutlined, SearchOutlined} from '@ant-design/icons';
import {Button, Form, Input, Space} from 'antd';
import BaseBizTable, {BaseTableUtils, FaberTable} from '@/components/base-table';
import modelService from '@/services/admin/area';
import Admin from '@/props/admin';
import AreaModal from './modal/AreaModal';
import {clearForm, useDelete, useExport, useTableQueryParams} from '@/utils/myHooks';
import {AuthDelBtn, FaHref} from "@/components/decorator";

const serviceName = '中国行政地区表';
const buzzModal = 'base_area';

export default function AreaList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, dicts, paginationProps } =
    useTableQueryParams<Admin.Area>(modelService.page, { sorter: { field: 'areaCode', order: 'ascend' } }, serviceName);

  const [exporting, fetchExportExcel] = useExport(modelService.exportExcel, queryParams);
  const [handleDelete] = useDelete<number>(modelService.remove, fetchPageList, serviceName);

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      // BaseTableUtils.genSimpleSorterColumn('ID', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('名称', 'name', 150, sorter),
      BaseTableUtils.genDictSorterColumn('层级', 'level', 70, sorter, dicts, 'common_area_level'),
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
    <div className="fa-full-content fa-flex-column">
      <div className="fa-flex-row-center fa-p8">
        <strong style={{ fontSize: '18px' }}>{serviceName}</strong>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form style={{ flex: 1, flexDirection: 'row-reverse' }} form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入名称" />
            </Form.Item>
          </Form>

          <Space>
            <Button onClick={() => form.submit()} loading={loading} icon={<SearchOutlined />}>查询</Button>
            <Button onClick={() => clearForm(form)} loading={loading}>重置</Button>
            <AreaModal title={`新增${serviceName}信息`} fetchFinish={fetchPageList} destroyOnClose={false}>
              <Button icon={<PlusOutlined />} type="primary">新增</Button>
            </AreaModal>
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

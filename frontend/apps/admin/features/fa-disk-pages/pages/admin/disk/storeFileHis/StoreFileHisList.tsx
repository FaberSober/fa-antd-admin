import React from 'react';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import { AuthDelBtn, BaseBizTable, BaseTableUtils, clearForm, FaberTable, useDelete, useExport, useTableQueryParams } from '@fa/ui';
import { storeFileHisApi as api } from '@/services';
import { Disk } from '@/types';
import StoreFileHisModal from './modal/StoreFileHisModal';

const serviceName = 'STORE-文件-历史记录';
const biz = 'disk_store_file_his';

/**
 * STORE-文件-历史记录表格查询
 */
export default function StoreFileHisList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, paginationProps } =
          useTableQueryParams<Disk.StoreFileHis>(api.page, {}, serviceName)

  const [handleDelete] = useDelete<string>(api.remove, fetchPageList, serviceName)
  const [exporting, fetchExportExcel] = useExport(api.exportExcel, queryParams)

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIdColumn('ID', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('存储文件ID', 'storeFileId', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('版本文件ID', 'fileSaveId', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('Office文件变更内容zip包文件ID（适用于onlyoffice）', 'changeFileId', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('文件名', 'fileName', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('版本号', 'ver', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('备注', 'remark', 100, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'menu',
        render: (_, r) => (
          <Space>
            <StoreFileHisModal editBtn title={`编辑${serviceName}信息`} record={r} fetchFinish={fetchPageList} />
            <AuthDelBtn handleDelete={() => handleDelete(r.id)} />
          </Space>
        ),
        width: 120,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Disk.StoreFileHis>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', padding: 8 }}>
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="search" label="搜索">
              <Input placeholder="请输入搜索内容" />
            </Form.Item>
          </Form>

          <Space>
            <Button onClick={() => form.submit()} loading={loading} icon={<SearchOutlined />}>查询</Button>
            <Button onClick={() => clearForm(form)}>重置</Button>
            <StoreFileHisModal addBtn title={`新增${serviceName}信息`} fetchFinish={fetchPageList} />
            <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>导出</Button>
          </Space>
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
        batchDelete={(ids) => api.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
      />
    </div>
  );
}

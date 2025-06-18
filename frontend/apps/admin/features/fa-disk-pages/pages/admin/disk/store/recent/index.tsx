import React, { useContext, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import { AuthDelBtn, BaseBizTable, BaseTableUtils, clearForm, FaberTable, FaUtils, useDelete, useTableQueryParams } from '@fa/ui';
import { Disk } from '@/types';
import { storeFileApi as api } from '@/services';
import { DiskContext } from '@/layout';
import { trim } from 'lodash';
import { FileIcon } from "@/components";

const serviceName = '最近文件';
const biz = 'disk_store_file_recent';

/**
 * STORE-库最近文件
 */
export default function StoreFileRecentList() {
  const { bucket } = useContext(DiskContext);
  const [form] = Form.useForm();

  const {
    queryParams,
    setFormValues,
    handleTableChange,
    setSceneId,
    setConditionList,
    fetchPageList,
    setExtraParams,
    loading,
    list,
    paginationProps,
  } = useTableQueryParams<Disk.StoreFile>(api.queryFilePage, { extraParams: { dir: false, bucketId: bucket.id } }, serviceName);

  useEffect(() => {
    setExtraParams({ dir: false, bucketId: bucket.id });
  }, [bucket]);

  const [handleDelete] = useDelete<number>(api.remove, fetchPageList, serviceName);

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIdColumn('ID', 'id', 70, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('名称', 'name', undefined, sorter),
        render: (_val, r) => (
          <div className="fa-flex-row-center">
            <a className="fa-flex-row-center" style={{ color: '#333' }}>
              <FileIcon file={r} width={30} style={{ marginRight: 6 }} />
              <div>
                <div>{r.name}</div>
                <div style={{ fontSize: '6px', color: '#999' }}>
                  {trim(r.fullPath)
                    .split(',')
                    .map((i) => i.replaceAll('#', ''))
                    .join('/')}
                </div>
              </div>
            </a>
          </div>
        ),
      },
      {
        ...BaseTableUtils.genSimpleSorterColumn('大小', 'size', 120, sorter),
        render: (val) => FaUtils.sizeToHuman(val, 0),
      },
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'menu',
        render: (_, r) => (
          <Space>
            <AuthDelBtn handleDelete={() => handleDelete(r.id)} />
          </Space>
        ),
        width: 80,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Disk.StoreFile>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', padding: 8 }}>
        <div className="fa-h3">{serviceName}</div>
        <div className="fa-table-subtitle">
          <span>展示库最近文件列表</span>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入文件名称" />
            </Form.Item>
          </Form>

          <Space>
            <Button onClick={() => form.submit()} loading={loading} icon={<SearchOutlined />}>
              查询
            </Button>
            <Button onClick={() => clearForm(form)}>
              重置
            </Button>
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
        showComplexQuery={false}
      />
    </div>
  );
}

import React from 'react';
import { DownloadOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import {
  AuthDelBtn,
  BaseBizTable,
  BaseDrawer,
  BaseTableUtils,
  clearForm,
  DictDataSelector,
  type FaberTable,
  FaHref,
  useDelete,
  useExport,
  useTableQueryParams,
} from '@fa/ui';
import type { Admin } from '@/types';
import { noticeApi } from '@features/fa-admin-pages/services';
import NoticeModal from './modal/NoticeModal';
import NoticeView from './cube/NoticeView';

const serviceName = '通知与公告';
const biz = 'base_notice.v1';

export default function NoticeList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Admin.Notice>(noticeApi.page, { sorter: { field: 'crtTime', order: 'descend' } }, serviceName);

  const [exporting, fetchExportExcel] = useExport(noticeApi.exportExcel, queryParams);
  const [handleDelete] = useDelete<number>(noticeApi.remove, fetchPageList, serviceName);

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      // BaseTableUtils.genSimpleSorterColumn('ID', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('标题', 'title', undefined, sorter),
      // BaseTableUtils.genSimpleSorterColumn('内容', 'content', undefined, sorter),
      BaseTableUtils.genBoolSorterColumn('有效', 'status', 70, sorter),
      BaseTableUtils.genBoolSorterColumn('强提醒', 'strongNotice', 90, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, r: Admin.Notice) => (
          <Space>
            <BaseDrawer triggerDom={<FaHref text="查看" icon={<EyeOutlined />} />}>
              <NoticeView item={r} />
            </BaseDrawer>
            <NoticeModal editBtn title={`编辑${serviceName}信息`} record={r} fetchFinish={fetchPageList} />
            <AuthDelBtn handleDelete={() => handleDelete(r.id)} />
          </Space>
        ),
        width: 170,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Admin.Notice>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div className="fa-flex-row-center fa-p8">
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="status" label="状态">
              <DictDataSelector dictLabel="common.enum.true_or_false" />
            </Form.Item>
            <Form.Item name="title" label="标题">
              <Input placeholder="请输入标题" allowClear />
            </Form.Item>

            <Space>
              <Button htmlType="submit" loading={loading} icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={() => clearForm(form)}>重置</Button>
              <NoticeModal addBtn title={`新增${serviceName}信息`} fetchFinish={fetchPageList} />
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
        batchDelete={(ids) => noticeApi.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
      />
    </div>
  );
}

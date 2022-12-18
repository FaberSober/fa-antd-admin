import React from 'react';
import {DownloadOutlined, EditOutlined, PlusOutlined, SearchOutlined} from '@ant-design/icons';
import {Button, Card, Form, Image, Input, Space} from 'antd';
import BaseBizTable, {BaseTableUtils, FaberTable} from '@/components/base-table';
import modelService from '@/services/admin/notice';
import * as Admin from '@/props/admin';
import NoticeModal from './modal/NoticeModal';
import {DictDataSelector} from '@/components/base-dict';
import {clearForm, useDelete, useExport, useTableQueryParams} from '@/utils/myHooks';
import {previewImage} from '@/utils/utils';
import {AuthDelBtn, FaHref} from "@/components/decorator";

const serviceName = '通知与公告';
const biz = 'base_notice';

export default function NoticeList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, dicts, paginationProps } =
    useTableQueryParams<Admin.Notice>(modelService.page, { sorter: { field: 'crtTime', order: 'descend' } }, serviceName);

  const [exporting, fetchExportExcel] = useExport(modelService.exportExcel, queryParams);
  const [handleDelete] = useDelete<number>(modelService.remove, fetchPageList, serviceName);

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      // BaseTableUtils.genSimpleSorterColumn('ID', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('标题', 'title', 200, sorter),
      BaseTableUtils.genSimpleSorterColumn('内容', 'content', undefined, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('图片', 'url', 100, sorter),
        sorter: false,
        render: (val) => (val ? <Image src={previewImage(val, 200, 200)} width={70} height={70} preview={{ src: val }} /> : null),
      },
      BaseTableUtils.genBoolSorterColumn('有效', 'status', 70, sorter),
      BaseTableUtils.genBoolSorterColumn('强提醒', 'strongNotice', 90, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (text: string, record: Admin.Notice) => (
          <Space>
            <NoticeModal title={`编辑${serviceName}信息`} record={record} fetchFinish={fetchPageList}>
              <FaHref icon={<EditOutlined />} text="编辑" />
            </NoticeModal>
            <AuthDelBtn handleDelete={() => handleDelete(record.id)} />
          </Space>
        ),
        width: 120,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Admin.Notice>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div className="fa-flex-row-center fa-p8">
        <strong style={{ fontSize: '18px' }}>{serviceName}</strong>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form style={{ flex: 1, flexDirection: 'row-reverse' }} form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="status" label="状态">
              <DictDataSelector dictLabel="common.enum.true_or_false" />
            </Form.Item>
            <Form.Item name="title" label="标题">
              <Input placeholder="请输入标题" />
            </Form.Item>
          </Form>

          <Space>
            <Button onClick={() => form.submit()} loading={loading} icon={<SearchOutlined />}>查询</Button>
            <Button onClick={() => clearForm(form)} loading={loading}>重置</Button>
            <NoticeModal title={`新增${serviceName}信息`} fetchFinish={fetchPageList}>
              <Button icon={<PlusOutlined />} type="primary">新增</Button>
            </NoticeModal>
            <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>导出</Button>
          </Space>
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
        batchDelete={(ids) => modelService.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
      />
    </div>
  );
}

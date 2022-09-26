import React from 'react';
import {DownloadOutlined, EditOutlined, PlusOutlined, SearchOutlined} from '@ant-design/icons';
import {Button, Card, Form, Image, Input, Space} from 'antd';
import BaseBizTable, {BaseTableUtils, FaberTable} from '@/components/base-table';
import modelService from '@/services/admin/notice';
import Admin from '@/props/admin';
import NoticeModal from './modal/NoticeModal';
import {DictDataSelector} from '@/components/base-dict';
import {clearForm, useDelete, useExport, useTableQueryParams} from '@/utils/myHooks';
import {previewImage} from '@/utils/utils';
import {FaHref} from "@/components/decorator";

const serviceName = '通知与公告';
const buzzModal = 'base_notice';

export default function NoticeList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, dicts, paginationProps } =
    useTableQueryParams<Admin.Notice>(modelService.page, { sorter: { field: 'crtTime', order: 'descend' } }, serviceName);

  const [exporting, fetchExportExcel] = useExport(modelService.exportExcel, queryParams);
  const [handleDelete] = useDelete<number>(modelService.remove, fetchPageList, serviceName);

  /** 生成表格字段List */
  function genColumns(): FaberTable.ColumnsProp<Admin.Notice>[] {
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
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: 12 }}>
        <div style={{ display: 'flex' }}>
          <strong style={{ fontSize: '18px' }}>{serviceName}</strong>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form style={{ flex: 1, flexDirection: 'row-reverse' }} form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="status" label="状态">
              <DictDataSelector dictLabel="common.enum.true_or_false" />
            </Form.Item>
            <Form.Item name="title" label="标题">
              <Input placeholder="请输入标题" />
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
              <NoticeModal title={`新增${serviceName}信息`} fetchFinish={fetchPageList} destroyOnClose={false}>
                <Button icon={<PlusOutlined />} type="primary">
                  新增
                </Button>
              </NoticeModal>
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

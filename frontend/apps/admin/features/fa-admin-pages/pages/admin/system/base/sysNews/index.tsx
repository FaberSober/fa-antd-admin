import React from 'react';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Image, Input, Space } from 'antd';
import { AuthDelBtn, BaseBizTable, BaseDrawer, BaseTableUtils, clearForm, type FaberTable, FaHref, useDelete, useTableQueryParams } from '@fa/ui';
import { fileSaveApi, sysNewsApi as api } from '@features/fa-admin-pages/services';
import type { Admin } from '@/types';
import SysNewsModal from './modal/SysNewsModal';
import SysNewsView from './cube/SysNewsView';

const serviceName = '系统新闻';
const biz = 'base_sys_news';

/**
 * BASE-系统-新闻表格查询
 */
export default function SysNewsList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Admin.SysNews>(api.page, {}, serviceName);

  const [handleDelete] = useDelete<number>(api.remove, fetchPageList, serviceName);

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIdColumn('ID', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('标题', 'title', undefined, sorter),
      // BaseTableUtils.genSimpleSorterColumn('内容', 'content', 100, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('封面', 'cover', 100, sorter),
        render: (v) => (
          <Image
            width={20}
            // height={width}
            src={fileSaveApi.genLocalGetFilePreview(v)}
            preview={{
              src: fileSaveApi.genLocalGetFile(v),
            }}
          />
        ),
      },
      BaseTableUtils.genSimpleSorterColumn('作者', 'author', 100, sorter),
      BaseTableUtils.genTimeSorterColumn('发布时间', 'pubTime', 170, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'menu',
        render: (_, r) => (
          <Space>
            <BaseDrawer triggerDom={<FaHref text="查看" icon={<EyeOutlined />} />}>
              <SysNewsView item={r} />
            </BaseDrawer>
            <SysNewsModal editBtn title={`编辑${serviceName}信息`} record={r} fetchFinish={fetchPageList} />
            <AuthDelBtn handleDelete={() => handleDelete(r.id)} />
          </Space>
        ),
        width: 170,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Admin.SysNews>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', padding: 8 }}>
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="title" label="标题">
              <Input placeholder="请输入标题" allowClear />
            </Form.Item>
            <Form.Item name="author" label="作者">
              <Input placeholder="请输入作者" allowClear />
            </Form.Item>

            <Space>
              <Button htmlType="submit" loading={loading} icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={() => clearForm(form)}>重置</Button>
              <SysNewsModal addBtn title={`新增${serviceName}信息`} fetchFinish={fetchPageList} />
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
        batchDelete={(ids) => api.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
      />
    </div>
  );
}

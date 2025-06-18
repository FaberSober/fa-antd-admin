import React from 'react';
import { DownloadOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Space } from 'antd';
import {
  AuthDelBtn,
  BaseBizTable,
  BaseDrawer,
  BaseTableUtils,
  clearForm,
  DictEnumApiSelector,
  type FaberTable,
  FaHref,
  FaUtils,
  useDelete,
  useDeleteByQuery,
  useExport,
  useTableQueryParams,
} from '@fa/ui';
import type { Admin } from '@/types';
import { logApiApi as api } from '@features/fa-admin-pages/services';
import LogApiView from '@features/fa-admin-pages/pages/admin/system/base/logApi/cube/LogApiView';

const serviceName = '请求日志';
const biz = 'base_log_api';

export default function LogApiList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, dicts, paginationProps } =
    useTableQueryParams<Admin.LogApi>(api.page, {}, serviceName);

  const [handleDelete] = useDelete<string>(api.remove, fetchPageList, serviceName);
  const [_, deleteByQuery] = useDeleteByQuery(api.removeByQuery, queryParams, fetchPageList);
  const [exporting, fetchExportExcel] = useExport(api.exportExcel, queryParams);

  function handleDeleteAll() {
    Modal.confirm({
      title: '清空日志',
      content: '清空日志后不可恢复，是否确认清空？',
      okText: '清空',
      okButtonProps: {danger: true},
      onOk: () => api.deleteAll().then(res => {
        FaUtils.showResponse(res, '清空日志');
        fetchPageList();
      }),
    })
  }

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIdColumn('序号', 'id', 70, sorter),
      BaseTableUtils.genEnumSorterColumn('类型', 'crud', 100, sorter, dicts, false),
      BaseTableUtils.genSimpleSorterColumn('模块', 'biz', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('操作', 'opr', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('操作备注', 'oprRemark', 120, sorter),
      BaseTableUtils.genSimpleSorterColumn('请求URL', 'url', undefined, sorter, false),
      BaseTableUtils.genSimpleSorterColumn('请求', 'method', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('客户端', 'agent', 100, sorter, false),
      BaseTableUtils.genSimpleSorterColumn('操作系统', 'os', 100, sorter, false),
      BaseTableUtils.genSimpleSorterColumn('浏览器', 'browser', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('浏览器版本', 'version', 120, sorter),
      BaseTableUtils.genBoolSorterColumn('手机', 'mobile', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('来源', 'faFrom', 80, sorter),
      BaseTableUtils.genSimpleSorterColumn('版本号', 'versionCode', 80, sorter),
      BaseTableUtils.genSimpleSorterColumn('版本名', 'versionName', 80, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('请求大小', 'reqSize', 90, sorter),
        render: (val) => FaUtils.sizeToHuman(val / 8, 0),
      },
      {
        ...BaseTableUtils.genSimpleSorterColumn('返回大小', 'retSize', 90, sorter),
        render: (val) => FaUtils.sizeToHuman(val / 8, 0),
      },
      BaseTableUtils.genSimpleSorterColumn('花费时间', 'duration', 90, sorter),
      BaseTableUtils.genSimpleSorterColumn('省', 'pro', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('市', 'city', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('地址', 'addr', 150, sorter),
      BaseTableUtils.genSimpleSorterColumn('返回码', 'retStatus', 80, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      {
        title: '操作',
        dataIndex: 'menu',
        render: (_, record) => (
          <Space>
            <BaseDrawer triggerDom={<FaHref icon={<EyeOutlined />} text="查看" />}>
              <LogApiView record={record} />
            </BaseDrawer>
            <AuthDelBtn handleDelete={() => handleDelete(record.id)} />
          </Space>
        ),
        width: 120,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Admin.LogApi>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div className="fa-flex-row-center fa-p8">
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="crud" label="类型">
              <DictEnumApiSelector enumName="LogCrudEnum" />
            </Form.Item>
            <Form.Item name="biz" label="模块">
              <Input placeholder="请输入模块" allowClear />
            </Form.Item>
            <Form.Item name="opr" label="操作">
              <Input placeholder="请输入操作" allowClear />
            </Form.Item>
            <Form.Item name="url" label="URL">
              <Input placeholder="请输入请求URL" allowClear />
            </Form.Item>

            <Space>
              <Button htmlType="submit" loading={loading} icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={() => clearForm(form)}>重置</Button>
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
        batchDelete={(ids) => api.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
        showDeleteByQuery
        onDeleteByQuery={deleteByQuery}
        renderQueryAll={() => (
          <Button type="primary" danger onClick={handleDeleteAll}>清空日志</Button>
        )}
      />
    </div>
  );
}

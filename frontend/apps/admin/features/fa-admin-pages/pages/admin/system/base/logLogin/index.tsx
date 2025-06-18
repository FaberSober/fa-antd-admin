import React from 'react';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import { AuthDelBtn, BaseBizTable, BaseTableUtils, clearForm, type FaberTable, useDelete, useExport, useTableQueryParams } from '@fa/ui';
import type { Admin } from '@/types';
import { logLoginApi } from '@features/fa-admin-pages/services';

const serviceName = '登录日志';
const biz = 'base_log_login_v1';

export default function LogLoginList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Admin.LogLogin>(logLoginApi.page, {}, serviceName);

  const [handleDelete] = useDelete<number>(logLoginApi.remove, fetchPageList, serviceName);
  const [exporting, fetchExportExcel] = useExport(logLoginApi.exportExcel, queryParams);

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIdColumn('序号', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('访问客户端', 'agent', undefined, sorter, false),
      BaseTableUtils.genSimpleSorterColumn('操作系统', 'os', undefined, sorter),
      BaseTableUtils.genSimpleSorterColumn('浏览器', 'browser', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('浏览器版本', 'version', 120, sorter),
      BaseTableUtils.genBoolSorterColumn('手机', 'mobile', 60, sorter, false),
      BaseTableUtils.genSimpleSorterColumn('省', 'pro', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('市', 'city', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('地址', 'addr', 150, sorter),
      ...BaseTableUtils.genCtrColumns(sorter, true, true),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, record) => (
          <Space>
            <AuthDelBtn handleDelete={() => handleDelete(record.id)} />
          </Space>
        ),
        width: 70,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Admin.LogLogin>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div className="fa-flex-row-center fa-p8">
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="crtName" label="创建用户">
              <Input placeholder="请输入创建用户" allowClear />
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
        batchDelete={(ids) => logLoginApi.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
      />
    </div>
  );
}

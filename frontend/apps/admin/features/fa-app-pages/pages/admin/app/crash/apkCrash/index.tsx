import React from 'react';
import { DownloadOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import { AuthDelBtn, BaseBizTable, BaseDrawer, BaseTableUtils, clearForm, type FaberTable, FaHref, useDelete, useExport, useTableQueryParams } from '@fa/ui';
import { apkCrashApi as api } from '@/services';
import type { App } from '@/types';
import ApkCrashView from "@features/fa-app-pages/pages/admin/app/crash/apkCrash/cube/ApkCrashView";

const serviceName = 'APK崩溃日志表';
const biz = 'app_apk_crash';

/**
 * APP-APK崩溃日志表表格查询
 */
export default function ApkCrashList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<App.ApkCrash>(api.page, {}, serviceName)

  const [handleDelete] = useDelete<number>(api.remove, fetchPageList, serviceName)
  const [exporting, fetchExportExcel] = useExport(api.exportExcel, queryParams)

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIdColumn('ID', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('应用ID', 'appId', 100, sorter, false),
      BaseTableUtils.genSimpleSorterColumn('应用名称', 'name', 130, sorter),
      BaseTableUtils.genSimpleSorterColumn('应用包名', 'applicationId', 200, sorter),
      BaseTableUtils.genSimpleSorterColumn('版本号', 'versionCode', 80, sorter),
      BaseTableUtils.genSimpleSorterColumn('版本名', 'versionName', 80, sorter),
      BaseTableUtils.genSimpleSorterColumn('错误日志', 'message', 200, sorter),
      // BaseTableUtils.genSimpleSorterColumn('崩溃日志详情', 'detail', 100, sorter),
      BaseTableUtils.genTimeSorterColumn('崩溃时间', 'crashTime', 170, sorter),
      BaseTableUtils.genSimpleSorterColumn('rom信息', 'romInfo', 200, sorter, false),
      BaseTableUtils.genSimpleSorterColumn('设备厂商', 'deviceManufacturer', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('设备型号', 'deviceModel', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('系统版本', 'androidVersion', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('sdk版本', 'androidSdk', 85, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'menu',
        render: (_, r) => (
          <Space>
            <BaseDrawer title="查看崩溃日志详情" triggerDom={<FaHref icon={<EyeOutlined />} text="详情" />} width={1000}>
              <ApkCrashView apkCrash={r} />
            </BaseDrawer>
            <AuthDelBtn handleDelete={() => handleDelete(r.id)} />
          </Space>
        ),
        width: 120,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<App.ApkCrash>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', padding: 8 }}>
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="message" label="错误日志">
              <Input placeholder="请输入错误日志" />
            </Form.Item>
          </Form>

          <Space>
            <Button onClick={() => form.submit()} loading={loading} icon={<SearchOutlined />}>查询</Button>
            <Button onClick={() => clearForm(form)}>重置</Button>
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

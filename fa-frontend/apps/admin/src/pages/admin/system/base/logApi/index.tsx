import React from 'react';
import {DownloadOutlined, EyeOutlined, SearchOutlined} from '@ant-design/icons';
import {Button, Card, Form, Input, Space} from 'antd';
import BaseBizTable, {BaseTableUtils, FaberTable} from '@/components/base-table';
import {clearForm, useDelete, useExport, useTableQueryParams} from "@/utils/myHooks";
import modelService from '@/services/admin/logApi';
import * as Admin from '@/props/admin';
import LogApiDrawer from './drawer/LogApiDrawer';
import {AuthDelBtn} from "@/components/decorator";

const serviceName = 'URL请求日志';
const biz = 'base_log_api';

export default function LogApiList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, dicts, paginationProps } =
    useTableQueryParams<Admin.LogApi>(modelService.page, {}, serviceName)

  const [handleDelete] = useDelete<string>(modelService.remove, fetchPageList, serviceName)
  const [exporting, fetchExportExcel] = useExport(modelService.exportExcel, queryParams)

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIdColumn('序号', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('请求URL', 'url', undefined, sorter),
      BaseTableUtils.genSimpleSorterColumn('请求类型', 'method', 90, sorter),
      BaseTableUtils.genSimpleSorterColumn('客户端', 'agent', 100, sorter, false),
      BaseTableUtils.genSimpleSorterColumn('操作系统', 'os', 100, sorter, false),
      BaseTableUtils.genSimpleSorterColumn('浏览器', 'browser', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('浏览器版本', 'version', 120, sorter),
      BaseTableUtils.genEnumSorterColumn('手机', 'mobile', 60, sorter, dicts, false),
      BaseTableUtils.genSimpleSorterColumn('请求大小', 'reqSize', 90, sorter),
      BaseTableUtils.genSimpleSorterColumn('返回大小', 'retSize', 90, sorter),
      BaseTableUtils.genSimpleSorterColumn('花费时间', 'duration', 90, sorter),
      BaseTableUtils.genSimpleSorterColumn('省', 'pro', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('市', 'city', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('地址', 'addr', 150, sorter),
      BaseTableUtils.genSimpleSorterColumn('返回码', 'retStatus', 80, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, record) => (
          <Space>
            <LogApiDrawer record={record}>
              <a><EyeOutlined />查看</a>
            </LogApiDrawer>
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
        <strong style={{ fontSize: '18px' }}>{serviceName}</strong>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="url" label="URL">
              <Input placeholder="请输入请求URL" />
            </Form.Item>
          </Form>

          <Space>
            <Button onClick={() => form.submit()} loading={loading} icon={<SearchOutlined />}>查询</Button>
            <Button onClick={() => clearForm(form)} loading={loading}>重置</Button>
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

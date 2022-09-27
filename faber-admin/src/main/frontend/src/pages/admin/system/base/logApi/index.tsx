import React from 'react';
import {DownloadOutlined, EyeOutlined, SearchOutlined} from '@ant-design/icons';
import {Button, Card, Form, Input, Space} from 'antd';
import BaseBizTable, {BaseTableUtils, FaberTable} from '@/components/base-table';
import {clearForm, useDelete, useExport, useTableQueryParams} from "@/utils/myHooks";
import modelService from '@/services/admin/logApi';
import Admin from '@/props/admin';
import LogApiDrawer from './drawer/LogApiDrawer';

const serviceName = 'URL请求日志';
const buzzModal = 'base_log_api';

export default function LogApiList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, dicts, paginationProps } =
    useTableQueryParams<Admin.LogApi>(modelService.page, {}, serviceName)

  const [handleDelete] = useDelete<string>(modelService.remove, fetchPageList, serviceName)
  const [exporting, fetchExportExcel] = useExport(modelService.exportExcel, queryParams)

  /** 生成表格字段List */
  function genColumns():FaberTable.ColumnsProp<Admin.LogApi>[] {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIdColumn('序号', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('请求URL', 'url', undefined, sorter),
      BaseTableUtils.genSimpleSorterColumn('请求类型', 'method', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('客户端', 'agent', 100, sorter, false),
      BaseTableUtils.genSimpleSorterColumn('请求大小', 'reqSize', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('返回大小', 'retSize', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('花费时间', 'duration', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('省', 'pro', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('市', 'city', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('地址', 'addr', 150, sorter),
      BaseTableUtils.genSimpleSorterColumn('返回码', 'retStatus', 100, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, record) => (
          <Space>
            <LogApiDrawer record={record}>
              <a><EyeOutlined />查看</a>
            </LogApiDrawer>
            <BaseTableUtils.AuthDelBtn record={record} handleDelete={(r) => handleDelete(r.id)} permission={undefined} />
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
          <strong style={{ fontSize: '18px', marginLeft: 8 }}>{serviceName}</strong>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <div>
            <Form form={form} layout="inline" onFinish={setFormValues}>
              <Form.Item name="url" label="URL">
                <Input placeholder="请输入请求URL" />
              </Form.Item>
            </Form>
          </div>

          <div>
            <Space>
              <Button onClick={() => form.submit()} loading={loading} icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={() => clearForm(form)} loading={loading}>
                重置
              </Button>
              <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>导出</Button>
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

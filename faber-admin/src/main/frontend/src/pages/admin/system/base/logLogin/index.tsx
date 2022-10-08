import React from 'react';
import {DownloadOutlined, SearchOutlined} from '@ant-design/icons';
import {Button, Card, Form, Input, Space} from 'antd';
import BaseBizTable, {BaseTableUtils, FaberTable} from '@/components/base-table';
import {clearForm, useDelete, useExport, useTableQueryParams} from "@/utils/myHooks";
import modelService from '@/services/admin/logLogin';
import Admin from '@/props/admin';

const serviceName = '登录日志';
const buzzModal = 'base_log_login';

export default function LogLoginList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Admin.LogLogin>(modelService.page, {}, serviceName)

  const [handleDelete] = useDelete<number>(modelService.remove, fetchPageList, serviceName)
  const [exporting, fetchExportExcel] = useExport(modelService.exportExcel, queryParams)

  /** 生成表格字段List */
  function genColumns():FaberTable.ColumnsProp<Admin.LogLogin>[] {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIdColumn('序号', 'id', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('访问客户端', 'agent', undefined, sorter),
      BaseTableUtils.genSimpleSorterColumn('省', 'pro', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('市', 'city', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('地址', 'addr', 150, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, record) => (
          <Space>
            <BaseTableUtils.AuthDelBtn record={record} handleDelete={(r) => handleDelete(r.id)} />
          </Space>
        ),
        width: 70,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ];
  }

  return (
    <div className="faber-full-content fa-bg-white">
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', padding: 8 }}>
        <div style={{ display: 'flex' }}>
          <strong style={{ fontSize: '18px', marginLeft: 8 }}>{serviceName}</strong>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <div>
            <Form form={form} layout="inline" onFinish={setFormValues}>
              <Form.Item name="crtName" label="创建用户">
                <Input placeholder="请输入创建用户" />
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
    </div>
  );
}

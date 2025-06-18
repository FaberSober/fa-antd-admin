import React, { useState } from 'react';
import { DownloadOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Switch } from 'antd';
import { AuthDelBtn, BaseBizTable, BaseTableUtils, clearForm, type FaberTable, useDelete, useExport, useTableQueryParams } from '@fa/ui';
import { userDeviceApi as api } from '@features/fa-admin-pages/services';
import type { Admin } from '@/types';
import UserDeviceModal from './modal/UserDeviceModal';
import CommonExcelUploadModal from '@features/fa-admin-pages/components/excel/CommonExcelUploadModal';
import UserSearchSelect from '@features/fa-admin-pages/components/helper/UserSearchSelect';

const serviceName = '';
const biz = 'base_user_device';

function ItemEnable({ item, onChange }: { item: Admin.UserDevice; onChange: (i: Admin.UserDevice) => void }) {
  const [loading, setLoading] = useState(false);

  function handleEnableUpdate(enable: boolean) {
    setLoading(true);
    api
      .update(item.id, { ...item, enable })
      .then((_res) => {
        setLoading(false);
        onChange(item);
      })
      .catch(() => setLoading(false));
  }

  return <Switch checkedChildren="允许" unCheckedChildren="禁止" checked={item.enable} onChange={(e) => handleEnableUpdate(e)} loading={loading} />;
}

/**
 * BASE-用户设备表格查询
 */
export default function UserDeviceList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, setList, paginationProps } =
    useTableQueryParams<Admin.UserDevice>(api.page, {}, serviceName);

  const [handleDelete] = useDelete<number>(api.remove, fetchPageList, serviceName);
  const [exporting, fetchExportExcel] = useExport(api.exportExcel, queryParams);

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIdColumn('ID', 'id', 70, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('所属用户', 'userId', 100, sorter),
        render: (_, r) => <span>{r.userName}</span>,
        tcCondComponentElement: UserSearchSelect,
      },
      BaseTableUtils.genSimpleSorterColumn('设备ID', 'deviceId', 300, sorter),
      BaseTableUtils.genSimpleSorterColumn('设备型号', 'model', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('设备厂商', 'manufacturer', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('系统', 'os', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('系统版本号', 'osVersion', 120, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('是否允许访问', 'enable', undefined, sorter),
        render: (_v, r) => (
          <ItemEnable
            item={r}
            onChange={() => {
              setList(list.map((i) => (i.id === r.id ? { ...i, enable: !i.enable } : i)));
            }}
          />
        ),
      },
      BaseTableUtils.genTimeSorterColumn('最后在线时间', 'lastOnlineTime', 170, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'menu',
        render: (_, r) => (
          <Space>
            <UserDeviceModal editBtn title={`编辑${serviceName}信息`} record={r} fetchFinish={fetchPageList} />
            <AuthDelBtn handleDelete={() => handleDelete(r.id)} />
          </Space>
        ),
        width: 120,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Admin.UserDevice>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', padding: 8 }}>
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="deviceId" label="设备ID">
              <Input placeholder="请输入设备ID" allowClear />
            </Form.Item>

            <Space>
              <Button htmlType="submit" loading={loading} icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={() => clearForm(form)}>重置</Button>
              <UserDeviceModal addBtn title={`新增${serviceName}信息`} fetchFinish={fetchPageList} />
              <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>
                导出
              </Button>
              <CommonExcelUploadModal fetchFinish={fetchPageList} apiDownloadTplExcel={api.exportTplExcel} apiImportExcel={api.importExcel}>
                <Button icon={<UploadOutlined />}>上传</Button>
              </CommonExcelUploadModal>
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

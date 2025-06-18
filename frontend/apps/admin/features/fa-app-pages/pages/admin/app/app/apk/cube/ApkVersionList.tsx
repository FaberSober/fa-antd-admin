import React, { useEffect, useState } from 'react';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Popover, QRCode, Space, Switch } from 'antd';
import { AuthDelBtn, BaseBizTable, BaseTableUtils, clearForm, type FaberTable, FaUtils, useDelete, useExport, useTableQueryParams } from '@fa/ui';
import { apkVersionApi as api, fileSaveApi } from '@/services';
import type { App } from '@/types';
import ApkVersionModal from '../modal/ApkVersionModal';

const serviceName = 'APK历史版本';
const biz = 'app_apk_version';

export interface ApkVersionListProps {
  appId: number;
}

/**
 * APP-APK表表格查询
 */
export default function ApkVersionList({appId}:ApkVersionListProps) {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, setExtraParams, fetchPageList, loading, list, setList, paginationProps } =
    useTableQueryParams<App.ApkVersion>(api.page, {extraParams:{appId}}, serviceName)

  const [handleDelete] = useDelete<number>(api.remove, fetchPageList, serviceName)
  const [exporting, fetchExportExcel] = useExport(api.exportExcel, queryParams)

  useEffect(() => {
    setExtraParams({appId})
  }, [appId])

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIdColumn('ID', 'id', 70, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('图标', 'iconId', 45, sorter),
        sorter: false,
        render: (_, r) => (
          <div className="fa-flex-row-center">
            <img alt={r.name} style={{width: 20, height: 20}} src={fileSaveApi.genLocalGetFile(r.iconId)} />
          </div>
        )
      },
      {
        ...BaseTableUtils.genSimpleSorterColumn('应用名称', 'name', 120, sorter),
        render: (_, r) => (
          <Popover
            title="下载"
            content={(
              <div className="fa-flex-column-center">
                <QRCode
                  errorLevel="H"
                  value={`${window.location.origin}${fileSaveApi.genLocalGetFile(r.fileId)}`}
                  icon={fileSaveApi.genLocalGetFile(r.iconId)}
                />
                <a href={fileSaveApi.genLocalGetFile(r.fileId)} target="_blank" rel="noreferrer">点击下载</a>
              </div>
            )}
          >
            <a>{r.name}</a>
          </Popover>
        )
      },
      BaseTableUtils.genSimpleSorterColumn('版本号', 'versionCode', 90, sorter),
      BaseTableUtils.genSimpleSorterColumn('版本名称', 'versionName', 90, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('文件大小', 'size', 90, sorter),
        render: (val) => FaUtils.sizeToHuman(val),
      },
      BaseTableUtils.genSimpleSorterColumn('下载次数', 'downloadNum', 90, sorter),
      {
        ...BaseTableUtils.genBoolSorterColumn('强制更新', 'forceUpdate', 90, sorter),
        render: (_v, r) => (
          <ForceUpdate
            item={r}
            onChange={() => {
              setList(list.map(i => i.id === r.id ? {...i, forceUpdate: !i.forceUpdate } : i))
            }}
          />
        )
      },
      BaseTableUtils.genEllipsisSorterColumn('版本信息', 'remark', undefined, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'menu',
        render: (_, r) => (
          <Space>
            <ApkVersionModal editBtn title={`编辑${serviceName}信息`} record={r} fetchFinish={fetchPageList} />
            <AuthDelBtn handleDelete={() => handleDelete(r.id)} />
          </Space>
        ),
        width: 125,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<App.ApkVersion>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', padding: 8 }}>
        {/*<div className="fa-h3">{serviceName}</div>*/}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="versionCode" label="搜索">
              <Input placeholder="请输入版本号" />
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

function ForceUpdate({ item, onChange }: {item: App.ApkVersion, onChange: (i: App.ApkVersion) => void}) {
  const [loading, setLoading] = useState(false)

  function handleEnableUpdate(forceUpdate: boolean) {
    setLoading(true)
    api.update(item.id, { ...item, forceUpdate }).then(_res => {
      setLoading(false)
      onChange(item)
    }).catch(() => setLoading(false))
  }

  return (
    <Switch
      checkedChildren="强制"
      unCheckedChildren="否"
      checked={item.forceUpdate}
      onChange={e => handleEnableUpdate(e)}
      loading={loading}
    />
  )
}

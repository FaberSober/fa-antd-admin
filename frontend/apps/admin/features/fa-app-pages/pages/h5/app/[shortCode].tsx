import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import type {App} from "@features/fa-app-pages/types";
import {apkApi, apkVersionApi} from "@features/fa-app-pages/services";
import {fileSaveApi} from "@features/fa-admin-pages/services";
import {FaLabel, PageLoading} from "@fa/ui";
import {Button, Empty, Table} from "antd";
import {DownloadOutlined} from '@ant-design/icons';


/**
 * 短码展示APP下载界面
 * @author xu.pengfei
 * @date 2023/6/29 15:10
 */
export default function H5App() {
  const {shortCode} = useParams()

  const [loading, setLoading] = useState(false)
  const [apk, setApk] = useState<App.Apk>()
  const [apkVersionList, setApkVersionList] = useState<App.ApkVersion[]>([])

  useEffect(() => {
    setLoading(true)
    apkApi.getByShortCode({shortCode: shortCode!}).then(res => {
      setApk(res.data)
      setLoading(false)

      apkVersionApi.listByAppId({appId: res.data.id}).then(res2 => {
        setApkVersionList(res2.data)
      })
    }).catch(() => setLoading(false))
  }, [shortCode])

  function handleDownloadNew() {
    if (apk === undefined) return

    window.open(fileSaveApi.genLocalGetFile(apk.fileId))
    // 下载次数+1
    if (apkVersionList === undefined || apkVersionList.length === 0) return;
    apkVersionApi.addDownloadNum({ id: apkVersionList[apkVersionList.length - 1].id})
  }

  function handleDownloadVer(ver: App.ApkVersion) {
    window.open(fileSaveApi.genLocalGetFile(ver.fileId))
    // 下载次数+1
    if (apkVersionList === undefined || apkVersionList.length === 0) return;
    apkVersionApi.addDownloadNum({ id: ver.id})
  }

  if (loading) return <PageLoading />
  if (apk === undefined) return <Empty description="未找到APP信息" />

  return (
    <div className="fa-full-content fa-p12 fa-scroll-auto-y">

      <div className="fa-flex-column-center fa-mt24 fa-mb12">
        <img alt={apk.name} src={fileSaveApi.genLocalGetFile(apk.iconId)}/>

        <div className="fa-h2 fa-mb12">{apk.name}</div>
        <div className="fa-mb12">{apk.versionName}</div>
        <div className="fa-mb12">{apk.versionCode}</div>

        <div style={{ width: '50%' }}>
          <Button onClick={handleDownloadNew} type="primary" block size="large" icon={<DownloadOutlined />} style={{ borderRadius: 20 }}>下&nbsp;载</Button>
        </div>
      </div>

      <FaLabel title="历史版本" className="fa-mb12" />
      <Table
        rowKey="id"
        dataSource={apkVersionList}
        columns={[
          {title: '版本', dataIndex: 'versionName'},
          {title: '发布时间', dataIndex: 'crtTime', width: 170},
          {
            title: '操作',
            render: (_, r:App.ApkVersion) => {
              return (
                <div>
                  <Button onClick={() => handleDownloadVer(r)} size="small">下载</Button>
                </div>
              )
            },
            width: 70
          },
        ]}
        expandable={{
          expandedRowRender: (r:App.ApkVersion) => <div className="fa-break-word">{r.remark}</div>,
        }}
        size="small"
        pagination={false}
      />
    </div>
  )
}

import React, {useContext, useEffect, useState} from 'react';
import {storeFileHisApi} from "@features/fa-disk-pages/services";
import {Disk} from "@features/fa-disk-pages/types";
import {Space, Table} from "antd";
import {ApiEffectLayoutContext, FaHref, FaUtils} from "@fa/ui";
import {EyeOutlined} from "@ant-design/icons";
import {MenuLayoutContext} from "@features/fa-admin-pages/layout";


export interface FileSaveHisTableProps {
  storeFileId: number;
}

/**
 * @author xu.pengfei
 * @date 2023/3/15 21:22
 */
export default function FileSaveHisTable({storeFileId}: FileSaveHisTableProps) {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const {addTab} = useContext(MenuLayoutContext)
  const [array, setArray] = useState<Disk.StoreFileHis[]>([])

  useEffect(() => {
    storeFileHisApi.list({query: {storeFileId}, sorter: "id DESC"}).then(res => setArray(res.data))
  }, [])

  function handleView(i: Disk.StoreFileHis) {
    addTab({
      key: `/admin/common/doc/view/${i.fileSaveId}`,
      path: `/admin/common/doc/view/${i.fileSaveId}`,
      name: `编辑-${i.ver}-${i.fileName}`,
      type: 'inner', // iframe, inner-内部网页
      closeable: true,
    })
  }

  const loading = loadingEffect[storeFileHisApi.getUrl('list')]
  return (
    <div>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={array}
        columns={[
          {title: '版本号', dataIndex: 'ver'},
          {title: '文件名', dataIndex: 'fileName'},
          {title: '创建人', dataIndex: 'crtUser'},
          {title: '创建时间', dataIndex: 'crtTime'},
          {
            title: '操作',
            render: (_, r) => {
              const documentType = FaUtils.getDocumentTypeByName(r.fileName); // 判断是office文档
              return (
                <Space>
                  {documentType && <FaHref onClick={() => handleView(r)} icon={<EyeOutlined />} text="查看"/>}
                </Space>
              )
            }
          },
        ]}
        pagination={false}
        size="small"
      />
    </div>
  )
}
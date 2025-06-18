import React, { useEffect, useState } from 'react';
import { Disk } from "@/types";
import { FaUtils, PageLoading } from "@fa/ui";
import { fileSaveApi, storeFileApi } from "@/services";
import { Descriptions, Image, Input, QRCode } from "antd";
import FileSaveHisTable from "@features/fa-disk-pages/pages/admin/disk/store/alls/cube/FileSaveHisTable";


export interface FileSaveDetailProps {
  id: number;
}

/**
 * @author xu.pengfei
 * @date 2023/2/7 14:39
 */
export default function FileSaveDetail({id}: FileSaveDetailProps) {
  const [data, setData] = useState<Disk.StoreFile>();

  useEffect(() => {
    storeFileApi.getById(id).then(res => {
      setData(res.data)
    })
  }, [id])

  function handleSubmitInfo(e:any) {
    if (data == undefined) return
    if (data.info === e.target.value) return;

    data.info = e.target.value
    storeFileApi.updateInfo(data.id, {info: data.info}).then(res => {
      FaUtils.showResponse(res, "更新文件备注")
    })
  }

  if (data == undefined) return <PageLoading />

  return (
    <Descriptions bordered column={1} labelStyle={{ width: 120 }}>
      <Descriptions.Item label="名称">{data.name}</Descriptions.Item>
      <Descriptions.Item label="文件备注">
        <Input.TextArea
          className="fa-input-underline"
          defaultValue={data.info}
          onBlur={handleSubmitInfo}
          autoSize
          maxLength={255}
        />
      </Descriptions.Item>
      <Descriptions.Item label="创建人">{data.crtName}</Descriptions.Item>
      <Descriptions.Item label="创建时间">{data.crtTime}</Descriptions.Item>
      {FaUtils.isImg(data.type) && (
        <Descriptions.Item label="缩略图">
          <Image
            width={80}
            src={fileSaveApi.genLocalGetFilePreview(data.fileId)}
            preview={{
              src: fileSaveApi.genLocalGetFile(data.fileId),
            }}
          />
        </Descriptions.Item>
      )}
      <Descriptions.Item label="二维码">
        <QRCode value={`f/${data.id}`} />
      </Descriptions.Item>
      <Descriptions.Item label="历史版本">
        <FileSaveHisTable storeFileId={data.id} />
      </Descriptions.Item>

    </Descriptions>
  )
}
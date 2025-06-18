import React, { useContext, useState } from 'react';
import { ArrowsAltOutlined, ShrinkOutlined } from "@ant-design/icons";
import DiskContext from "@features/fa-disk-pages/layout/disk/context/DiskContext";
import './UploadFilePanel.scss';
import { Progress, Space } from "antd";
import { FaUtils } from "@fa/ui";



/**
 * 展示正在上传的文件列表
 * @author xu.pengfei
 * @date 2023/2/27 16:05
 */
export default function UploadFilePanel() {
  const {uploadFiles} = useContext(DiskContext)
  const [expand, setExpand] = useState(true)

  return (
    <div className="fa-disk-upload-file-panel" style={{ width: expand ? 440 : 200 }}>
      <div className="fa-disk-upload-file-panel-title">
        <div className="title">上传文件列表</div>

        <div className="fa-normal-btn" onClick={() => setExpand(!expand)}>
          {expand ? <ShrinkOutlined /> : <ArrowsAltOutlined />}
        </div>
      </div>

      {expand && (
        <div className="fa-disk-upload-file-panel-content">
          {uploadFiles.map(i => {
            return (
              <div key={i.id} className="fa-disk-upload-file-panel-item">
                <div className="name fa-break-word">{i.fileName}</div>
                <Space className="fa-subtitle">
                  <div>{FaUtils.sizeToHuman(i.loaded)}</div>
                  <div>/</div>
                  <div>{FaUtils.sizeToHuman(i.total)}</div>
                  <Progress type="circle" percent={FaUtils.tryToFixed(i.progress * 100, 0)} width={20} />
                </Space>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

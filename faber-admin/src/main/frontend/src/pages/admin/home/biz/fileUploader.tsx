import React, {useState} from 'react';
import {Card} from "antd";
import {UploadFileLocalMultiple} from "@/components/base-uploader";

/**
 * @author xu.pengfei
 * @date 2022/11/7
 */
export default function FileUploader() {
  // 这里可以设置初始化的文件ID列表
  const [array, setArray] = useState<string[]>(['3079317daffae128f0ea701d485533b6'])

  return (
    <div className="fa-full-content fa-padding-12">
      <Card title="多文件上传" style={{ marginBottom: 12 }}>
        <UploadFileLocalMultiple
          value={array}
          onChange={(v) => {
            console.log('文件全部上传完成回调', v)
            setArray(v)
          }}
        />
      </Card>

    </div>
  )
}

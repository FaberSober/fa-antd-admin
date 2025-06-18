import React, { useState } from 'react';
import { Card } from 'antd';
import { UploadFileLocal, UploadFileLocalMultiple } from '@fa/ui';

/**
 * @author xu.pengfei
 * @date 2022/11/7
 */
export default function FileUploader() {
  // 这里可以设置初始化的文件ID列表
  const [fileId, setFileId] = useState<string>();
  const [array, setArray] = useState<string[]>([]);

  return (
    <div className="fa-full-content fa-p12">
      <Card title="单文件上传" className="fa-mb12">
        <p>说明：1. onChange返回文件ID；</p>
        <UploadFileLocal
          value={fileId}
          onChange={(v) => {
            console.log('单文件上传完成回调', v);
            setFileId(v);
          }}
        />
        <p>返回值展示：{fileId}</p>
      </Card>

      <Card title="多文件上传" className="fa-mb12">
        <p>说明：1. 打开文件夹支持多选文件；2. 可设置最大选择文件数（这里设置为3）；3. onChange返回文件ID数组；</p>
        <UploadFileLocalMultiple
          value={array}
          onChange={(v) => {
            console.log('多文件上传完成回调', v);
            setArray(v);
          }}
          maxCount={3}
        />
        <p>返回值展示：{JSON.stringify(array)}</p>
      </Card>
    </div>
  );
}

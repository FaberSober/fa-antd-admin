import React, {useEffect, useState} from 'react';
import {find} from 'lodash'
import {Button, Upload, UploadProps} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import fileApi from '@/services/admin/fileSave';
import {getToken} from '@/utils/cache';
import {RES_CODE, TOKEN_KEY} from '@/configs/server.config';
import {UploadChangeParam} from 'antd/es/upload/interface';


export interface UploadFileLocalProps extends Omit<UploadProps, 'onChange'> {
  children?: any;
  description?: string;
  value?: string[];
  onChange?: (fileIds: string[]) => void;
}

const doneIds = []; // 记录已经上传完成的文件uid

/**
 * 多文件上传
 * @author xu.pengfei
 * @date 2021/4/2
 */
export default function UploadFileLocalMultiple({ children, description, onChange, value, ...props }: UploadFileLocalProps) {
  const [loading, setLoading] = useState(false);
  const [array, setArray] = useState<any[]>([]); // 文件列表

  useEffect(() => {
    if (value === undefined || value === null) return;

    setLoading(true);
    fileApi.getByIds(value).then((res) => {
      setLoading(false);
      if (res && res.status === RES_CODE.OK) {
        const fs = res.data.map(i => ({
          id: i.id,
          uid: i.id,
          size: i.size,
          name: i.name,
          url: fileApi.genLocalGetFile(i.id),
          status: 'done', // 状态有：uploading done error removed，被 beforeUpload 拦截的文件没有 status 属性
        }))
        setArray(fs);
      }
    }).catch(() => setLoading(false));
  }, [value]);

  function handleOnChange({ file, fileList }: UploadChangeParam) {
    // 记录上传完成的文件
    if (file.status === "done") {
      const id = file.response.data.id;
      doneIds.push({ ...file, id, url: fileApi.genLocalGetFile(id) })
    }

    // 处理过滤上传完成的文件
    const newArr = fileList.map(i => {
      const doneFile = find(doneIds, f => f.uid === i.uid)
      if (doneFile) {
        return doneFile;
      }
      return i;
    })

    // 更新文件列表
    setArray(newArr);

    // 检测是否全部上传完成
    const doneFileList = newArr.filter(i => i.status === 'done')
    if (doneFileList.length === newArr.length) {
      if (onChange) {
        onChange(doneFileList.map(f => f.id))
      }
    }
  }

  return (
    <Upload
      name="file"
      action={fileApi.uploadApi}
      headers={{
        [TOKEN_KEY]: getToken() || '',
      }}
      onChange={handleOnChange}
      fileList={array}
      multiple
      {...props}
    >
      {children ? (
        <span>{children}</span>
      ) : (
        <>
          <Button loading={loading}>
            <UploadOutlined /> 选择文件
          </Button>
          {description && <span>{description}</span>}
        </>
      )}
    </Upload>
  );
}

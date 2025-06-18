import React, { useEffect, useState } from 'react';
import { Button, message, Upload, UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { fileSaveApi } from '@/services';
import { RcFile } from 'antd/es/upload';
import { UploadChangeParam } from 'antd/es/upload/interface';
import { Fa, getToken } from '@fa/ui';

export interface UploadDiskFileProps extends Omit<UploadProps, 'onChange'> {
  children?: any;
  description?: string;
  value?: string;
  onChange?: (fileId: string | undefined) => void;
}

/**
 * 上传文件到本地服务器
 * @author xu.pengfei
 * @date 2021/4/2
 */
export default function UploadDiskFile({ children, description, onChange, value, ...props }: UploadDiskFileProps) {
  const [_, setLoading] = useState(false);
  const [array, setArray] = useState<any[]>([]);

  useEffect(() => {
    if (value === undefined || value == null) return;

    setLoading(true);
    fileSaveApi
      .getById(value)
      .then((res) => {
        setLoading(false);
        const fileData = res.data;
        setArray([{ uid: fileData.id, size: fileData.size, name: fileData.originalFilename, url: fileSaveApi.genLocalGetFile(fileData.id) }]);
      })
      .catch(() => setLoading(false));
  }, [value]);

  function beforeUpload(_file: RcFile) {
    // if (file.name && file.name.indexOf(' ') > -1) {
    //   message.error('文件名不能包含空格！');
    //   return false;
    // }
    // if (this.props.fileTypes && this.props.fileTypes[0]) {
    //   if (this.props.fileTypes.indexOf(file.type) === -1) {
    //     message.error(this.props.fileTypesMsg);
    //     return false;
    //   }
    // }
    return true;
  }

  function handleOnChange(info: UploadChangeParam) {
    const { fileList } = info;
    if (info.file.status === 'uploading') {
      // console.log('uploading', info.file, info.fileList);
      setLoading(true);
    } else if (info.file.status === 'done') {
      setLoading(false);
      message.success(`${info.file.name} 文件上传成功`);
      // console.log('info.file.status === \'done\'', info)
      if (info.file.response.status === 200) {
        if (onChange) {
          onChange(info.file.response.data.id);
        }
        setArray([info.file]);
      }
    } else if (info.file.status === 'error') {
      setLoading(false);
      message.error(`${info.file.name} 文件上传失败`);
    } else {
      setLoading(false);
    }
    setArray(fileList);
  }

  function handleRemove() {
    // console.log('handleRemove', file)
    if (onChange) {
      onChange(undefined);
    }
  }

  return (
    <Upload
      name="file"
      action={fileSaveApi.getUrl("upload")}
      headers={{
        [Fa.Constant.TOKEN_KEY]: getToken() || '',
      }}
      beforeUpload={beforeUpload}
      onChange={handleOnChange}
      onRemove={handleRemove}
      fileList={array}
      maxCount={1}
      showUploadList={false}
      {...props}
    >
      <Button>
        <UploadOutlined /> 上传文件
      </Button>
    </Upload>
  );
}

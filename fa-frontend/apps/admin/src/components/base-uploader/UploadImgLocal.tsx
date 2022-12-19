import React, { CSSProperties, useEffect, useState } from 'react';
import { message, Upload, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import fileApi from '@/services/admin/fileSave';
import { getToken } from '@/utils/cache';
import { RES_CODE, TOKEN_KEY } from '@/configs/server.config';
import { RcFile } from 'antd/es/upload';
import { UploadChangeParam } from 'antd/lib/upload/interface';
import { UploadFile } from 'antd/es/upload/interface';

interface IProps extends Omit<UploadProps, 'onChange'> {
  value?: string;
  onChange?: (fileId: string | undefined) => void;
  style?: CSSProperties;
}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function UploadImgQiniu({ value, onChange, style, ...props }: IProps) {
  const [loading, setLoading] = useState(false);
  const [array, setArray] = useState<any[]>([]);

  useEffect(() => {
    if (value === undefined || value == null) return;

    setLoading(true);
    fileApi
      .getById(value)
      .then((res) => {
        setLoading(false);
        if (res && res.status === RES_CODE.OK) {
          const fileData = res.data;
          setArray([
            { uid: fileData.id, size: fileData.size, name: fileData.name, url: fileApi.genLocalGetFile(fileData.id) },
          ]);
        }
      })
      .catch(() => setLoading(false));
  }, [value]);

  function beforeUpload(file: RcFile) {
    if (file.name && file.name.indexOf(' ') > -1) {
      message.error('文件名不能包含空格！');
      return false;
    }
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJPG) {
      message.error('你只能上传图片文件！');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error('图片大小不能超过10MB!');
      return false;
    }
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

  function handleRemove(file: UploadFile) {
    console.log('handleRemove', file);
    if (onChange) {
      onChange(undefined);
    }
  }

  return (
    <Upload
      name="file"
      listType="picture-card"
      // className="avatar-uploader"
      action={fileApi.uploadApi}
      headers={{
        [TOKEN_KEY]: getToken() || '',
      }}
      beforeUpload={beforeUpload}
      onChange={handleOnChange}
      onRemove={handleRemove}
      fileList={array}
      style={style}
      maxCount={1}
      {...props}
    >
      {array && array[0] ? null : (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div className="ant-upload-text">Upload</div>
        </div>
      )}
    </Upload>
  );
}

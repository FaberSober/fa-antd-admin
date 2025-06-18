import React, {CSSProperties, useState} from 'react';
import {message, Upload} from 'antd';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {fetchUploadImgQiniu} from './utils';

function beforeUpload(file: any) {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJPG) {
    message.error('你只能上传图片文件！');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小不能超过2MB!');
  }
  return isJPG && isLt2M;
}

export interface UploadImgQiniuProps {
  value?: string;
  onImgUploadSuccess?: (filePath: string) => void;
  prefix: string;
  onChange?: (path: string) => void;
  style?: CSSProperties;
}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function UploadImgQiniu({ value, onImgUploadSuccess, prefix, onChange, style }: UploadImgQiniuProps) {
  const [loading, setLoading] = useState(false);

  function handleChange(info: any) {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setLoading(false);
      if (onImgUploadSuccess) onImgUploadSuccess(info.file.response.path);
    }
  }

  function customRequest(req: any) {
    const { file, onError, onProgress, onSuccess } = req;
    setLoading(true);
    fetchUploadImgQiniu(
      file,
      prefix,
      file.name,
      (path, res) => {
        if (onChange) onChange(path);
        onSuccess({ ...res, path }, file);
      },
      (res) => {
        const { percent } = res.total;
        onProgress({ percent }, file);
      },
      (res) => {
        onError(new Error(res), file);
      }
    );
  }

  return (
    <Upload
      name="file"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      customRequest={customRequest}
      style={style}
    >
      {value ? (
        <img style={{ width: 200 }} src={`${value}?imageView2/1/w/100/h/100`} alt="" />
      ) : (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div className="ant-upload-text">上传</div>
        </div>
      )}
    </Upload>
  );
}

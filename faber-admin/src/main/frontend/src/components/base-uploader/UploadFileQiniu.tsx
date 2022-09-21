import React, { CSSProperties, useState } from 'react';
import { Button, Upload, UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { fetchUploadImgQiniu } from './utils';

// function beforeUpload(file: any) {
//   const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
//   if (!isJPG) {
//     message.error('你只能上传图片文件！');
//   }
//   const isLt2M = file.size / 1024 / 1024 < 2;
//   if (!isLt2M) {
//     message.error('图片大小不能超过2MB!');
//   }
//   return isJPG && isLt2M;
// }

interface IProps extends UploadProps {
  value?: string;
  onImgUploadSuccess?: (filePath: string) => void;
  prefix: string;
  onChange?: (path: any) => void;
  style?: CSSProperties;
  children?: any;
}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function UploadFileQiniu({ children, value, onImgUploadSuccess, prefix, onChange, style, ...props }: IProps) {
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
        setLoading(false);
        onError(new Error(res), file);
      }
    );
  }

  return (
    <Upload
      name="file"
      // listType="picture-card"
      // className="avatar-uploader"
      // showUploadList={false}
      // beforeUpload={beforeUpload}
      onChange={handleChange}
      customRequest={customRequest}
      style={style}
      {...props}
    >
      {children ? (
        <span>{children}</span>
      ) : (
        <Button loading={loading}>
          <UploadOutlined /> 选择文件
        </Button>
      )}
    </Upload>
  );
}

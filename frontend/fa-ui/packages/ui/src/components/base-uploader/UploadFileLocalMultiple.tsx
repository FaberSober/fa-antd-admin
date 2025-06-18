import React, { useEffect, useState } from 'react';
import { find } from 'lodash';
import { Button, Image, Upload, UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { fileSaveApi } from '@ui/services/base';
import { genAuthHeaders } from '@ui/utils/cache';
import { UploadChangeParam } from 'antd/es/upload/interface';


export interface UploadFileLocalMultipleProps extends Omit<UploadProps, 'onChange'> {
  children?: any;
  description?: string;
  value?: string[];
  onChange?: (fileIds: string[]) => void;
}

const doneIds: any[] = []; // 记录已经上传完成的文件uid

/**
 * 多文件上传
 * @author xu.pengfei
 * @date 2021/4/2
 */
export default function UploadFileLocalMultiple({ children, description, onChange, value, ...props }: UploadFileLocalMultipleProps) {
  const [loading, setLoading] = useState(false);
  const [array, setArray] = useState<any[]>([]); // 文件列表

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [srcImage, setSrcImage] = useState('');

  useEffect(() => {
    if (value === undefined || value === null) {
      return;
    }
    if (value instanceof Array && value.length === 0) {
      return;
    }

    setLoading(true);
    fileSaveApi.getByIds(value).then((res) => {
      setLoading(false);
      const fs = res.data.map((i) => ({
        id: i.id,
        uid: i.id,
        size: Number(i.size),
        name: i.originalFilename,
        url: fileSaveApi.genLocalGetFile(i.id),
        previewUrl: fileSaveApi.genLocalGetFilePreview(i.id),
        status: 'done', // 状态有：uploading done error removed，被 beforeUpload 拦截的文件没有 status 属性
      }));
      setArray(fs);
    }).catch(() => setLoading(false));
  }, [value]);

  function handleOnChange({ file, fileList }: UploadChangeParam) {
    // 记录上传完成的文件
    if (file.status === 'done') {
      const id = file.response.data.id;
      doneIds.push({ ...file, id, url: fileSaveApi.genLocalGetFile(id) });
    }

    // 处理过滤上传完成的文件
    const newArr = fileList.map((i) => {
      const doneFile = find(doneIds, (f) => f.uid === i.uid);
      if (doneFile) {
        return doneFile;
      }
      return i;
    });

    // 更新文件列表
    setArray(newArr);

    // 检测是否全部上传完成
    const doneFileList = newArr.filter((i) => i.status === 'done');
    if (doneFileList.length === newArr.length) {
      if (onChange) {
        onChange(doneFileList.map((f) => f.id));
      }
    }
  }

  const uploadImg = props.listType === 'picture-card' ? true : false;

  const handlePreview = async (file: any) => {
    console.log('handlePreview', file)
    if (uploadImg) {
      setPreviewImage(file.previewUrl);
      setSrcImage(file.url);
      setPreviewOpen(true);
    } else {
      window.open(file.url)
    }
  };

  // let canUpload = true;
  // if (props.maxCount) {
  //   canUpload = array.length < props.maxCount;
  // }

  return (
    <Upload
      name="file"
      action={fileSaveApi.uploadApi}
      headers={genAuthHeaders()}
      onChange={handleOnChange}
      fileList={array}
      multiple
      onPreview={handlePreview}
      {...props}
    >
      {children && <span>{children}</span>}
      {children === undefined && uploadImg && (
        <div>
          <UploadOutlined />
          <div>选择图片</div>
        </div>
        )}
      {children === undefined && !uploadImg && (
        <>
          <Button loading={loading}>
            <UploadOutlined /> 选择文件
          </Button>
          {description && <span>{description}</span>}
        </>
      )}

      <div style={{ display: 'none' }}>
        <Image
          width={200}
          style={{ display: 'none' }}
          src={previewImage}
          preview={{
            visible: previewOpen,
            src: srcImage,
            onVisibleChange: (value) => {
              setPreviewOpen(value);
            },
            getContainer: () => document.body,
          }}
        />
      </div>
    </Upload>
  );
}

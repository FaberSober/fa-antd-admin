import React, { useEffect, useState } from 'react';
import { Button, message, Upload, type UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {fileSaveApi} from '@ui/services/base';
import { genAuthHeaders } from '@ui/utils/cache';
import type { RcFile } from 'antd/es/upload';
import type { UploadChangeParam, UploadFile, UploadFileStatus } from 'antd/es/upload/interface';
import { isNil } from "lodash";


export interface UploadFileLocalProps extends Omit<UploadProps, 'onChange'> {
  children?: any;
  description?: string;
  value?: string | string[];
  onFileChange?: (info: UploadChangeParam) => void;
  onChange?: (fileId: string | string[] | undefined) => void;
}

/**
 * 上传文件到本地服务器
 * @author xu.pengfei
 * @date 2021/4/2
 */
export default function UploadFileLocal({ children, description, onFileChange, onChange, value, ...props }: UploadFileLocalProps) {
  const [loading, setLoading] = useState(false);
  const [array, setArray] = useState<any[]>([]);

  const multiple = props.multiple || false;

  useEffect(() => {
    if (value === undefined || value == null) return;

    setLoading(true);
    if (multiple) {
      const ids = value as string[];
      if (!isNil(ids) && ids.length > 0) {

        fileSaveApi.getByIds(value as string[]).then((res) => {
          setLoading(false);
          const fileList = res.data.map(i => ({
            uid: i.id,
            size: Number(i.size),
            name: i.originalFilename,
            url: fileSaveApi.genLocalGetFile(i.id),
            thumbUrl: fileSaveApi.genLocalGetFilePreview(i.id),
            previewUrl: fileSaveApi.genLocalGetFilePreview(i.id),
            status: 'done' as UploadFileStatus, // 状态有：uploading done error removed，被 beforeUpload 拦截的文件没有 status 属性
          }));
          setArray(fileList);
          if (onFileChange) {
            onFileChange({ file: fileList[0], fileList });
          }
        }).catch(() => setLoading(false));
      } else {
        setArray([])
        setLoading(false)
      }
    } else {
      fileSaveApi.getById(value as string).then((res) => {
        setLoading(false);
        const fileData = res.data;
        setArray([{ uid: fileData.id, size: fileData.size, name: fileData.originalFilename, url: fileSaveApi.genLocalGetFile(fileData.id) }]);
      }).catch(() => setLoading(false));
    }
  }, [value]);

  function beforeUpload(file: RcFile) {
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
    // console.log('info', info, array)
    if (onFileChange) {
      onFileChange(info)
    }
    const { fileList } = info;
    if (info.file.status === 'uploading') {
      // console.log('uploading', info.file, info.fileList);
      setLoading(true);
    } else if (info.file.status === 'done') {
      setLoading(false);
      message.success(`${info.file.name} 文件上传成功`);
      // console.log('info.file.status === \'done\'', info)
      if (info.file.response.status === 200) {
        const data = info.file.response.data;
        if (multiple) {
          const newArr = [ ...array, {
            id: data.id,
            uid: data.id,
            size: data.size,
            name: data.originalFilename,
            url: fileSaveApi.genLocalGetFile(data.id),
            previewUrl: fileSaveApi.genLocalGetFilePreview(data.id),
            status: 'done', // 状态有：uploading done error removed，被 beforeUpload 拦截的文件没有 status 属性
          } ]
          setArray(newArr);
          if (onChange) {
            onChange([ ...((value||[]) as string[]), info.file.response.data.id ]);
          }
        } else {
          if (onChange) {
            onChange(info.file.response.data.id);
          }
        }
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
    console.log('handleRemove', file)
    if (multiple) {
      const newArr = array.filter(i => i.uid !== file.uid);
      if (onChange) {
        onChange(newArr.map(i => i.uid));
      }
    } else {
      if (onChange) {
        onChange(undefined);
      }
    }
  }

  return (
    <Upload
      name="file"
      action={fileSaveApi.uploadApi}
      headers={genAuthHeaders()}
      beforeUpload={beforeUpload}
      onChange={handleOnChange}
      onRemove={handleRemove}
      fileList={array}
      maxCount={multiple ? 9 : 1}
      {...props}
    >
      {children ? (
        <span>{children}</span>
      ) : (
        <>
          <Button loading={loading} disabled={props.disabled}>
            <UploadOutlined /> 选择文件
          </Button>
          {description && <span>{description}</span>}
        </>
      )}
    </Upload>
  );
}

import React from 'react';
import { isNil } from 'lodash';
import { Image } from 'antd';
import { fileSaveApi } from '@features/fa-admin-pages/services';

export interface TableImageProps {
  imgFileId: string;
}

/**
 * 表格里的行展示图片
 * @author xu.pengfei
 * @date 2023/7/23 20:30
 */
export default function TableImage({ imgFileId }: TableImageProps) {
  if (isNil(imgFileId)) return null;
  return (
    <Image
      width={25}
      // height={width}
      src={fileSaveApi.genLocalGetFilePreview(imgFileId)}
      preview={{
        src: fileSaveApi.genLocalGetFile(imgFileId),
      }}
    />
  );
}

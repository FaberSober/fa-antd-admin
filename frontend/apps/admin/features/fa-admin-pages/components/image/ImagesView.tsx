import React from 'react';
import { Image } from 'antd';
import { fileSaveApi } from '@fa/ui';

export interface ImagesViewProps {
  imgs: string[]; // 图片附件ID数组
}

/**
 * @author xu.pengfei
 * @date 2023/11/15 16:36
 */
export default function ImagesView({ imgs }: ImagesViewProps) {
  return (
    <Image.PreviewGroup>
      {imgs.map((img) => {
        return (
          <Image
            key={img}
            // width={100}
            height={100}
            src={fileSaveApi.genLocalGetFilePreview(img)}
            preview={{ src: fileSaveApi.genLocalGetFile(img) }}
          />
        );
      })}
    </Image.PreviewGroup>
  );
}

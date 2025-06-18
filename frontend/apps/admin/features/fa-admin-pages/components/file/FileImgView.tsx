import React, { type CSSProperties } from 'react';
import { Image } from 'antd';
import { fileSaveApi } from '@features/fa-admin-pages/services';

export interface FileImgViewProps {
  fileId: string;
  width?: number | string | undefined;
  height?: number | string | undefined;
  style?: CSSProperties;
}

/**
 * @author xu.pengfei
 * @date 2022/12/29 13:58
 */
export default function FileImgView({ fileId, width = 20, height, style }: FileImgViewProps) {
  const divStyle = {
    // height: width,
    ...style,
  };

  return (
    <div className="fa-flex-row fa-flex-row-center" style={divStyle}>
      <Image
        width={width}
        height={height}
        src={fileSaveApi.genLocalGetFilePreview(fileId)}
        preview={{
          src: fileSaveApi.genLocalGetFile(fileId),
        }}
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}

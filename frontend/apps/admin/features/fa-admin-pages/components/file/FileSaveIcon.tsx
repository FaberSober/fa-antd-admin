import React, { type CSSProperties } from 'react';
import { Image } from 'antd';
import { FaUtils } from '@fa/ui';
import { fileSaveApi } from '@features/fa-admin-pages/services';
import VideoPlainModal from '../video/VideoPlainModal';
import FaFileViewModal from './FaFileViewModal';

export interface FileInfo {
  id: string;
  originalFilename: string;
  ext: string;
}

export interface FileSaveIconProps {
  file: FileInfo;
  width: number;
  style?: CSSProperties;
}

/**
 * @author xu.pengfei
 * @date 2022/12/29 13:58
 */
export default function FileSaveIcon({ file, width = 20, style }: FileSaveIconProps) {
  const divStyle = {
    height: width,
    ...style,
  };

  const isImg = FaUtils.isImg(file.ext);
  if (isImg) {
    return (
      <div className="fa-flex-row fa-flex-row-center" style={divStyle}>
        <Image
          width={width}
          // height={width}
          src={fileSaveApi.genLocalGetFilePreview(file.id)}
          preview={{
            src: fileSaveApi.genLocalGetFile(file.id),
          }}
        />
        <span>{file.originalFilename}</span>
        {/*<img src={fileSaveApi.genLocalGetFilePreview(file.id)} style={{ maxWidth: width, maxHeight: width }} alt={file.originalFilename} />*/}
      </div>
    );
  }

  const isVideo = FaUtils.isVideo(file.ext);
  if (isVideo) {
    return (
      <VideoPlainModal url={fileSaveApi.genLocalGetFile(file.id)}>
        <span>{file.originalFilename}</span>
      </VideoPlainModal>
    );
  }

  return (
    <FaFileViewModal fileId={file.id}>
      <span className="fa-cursor-pointer fa-text-link">{file.originalFilename}</span>
    </FaFileViewModal>
  );
}

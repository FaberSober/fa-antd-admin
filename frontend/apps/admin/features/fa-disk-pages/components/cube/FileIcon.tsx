import React, { CSSProperties } from 'react';
import { Disk } from '@/types';
import { FaUtils } from '@fa/ui';
import { FaIcon } from '@fa/icons';
import { fileSaveApi } from '@/services';

export interface FileIconProps {
  file: Disk.StoreFile;
  width: number;
  style?: CSSProperties;
}

/**
 * @author xu.pengfei
 * @date 2022/12/29 13:58
 */
export default function FileIcon({ file, width = 20, style }: FileIconProps) {
  const divStyle = {
    width,
    height: width,
    ...style,
  };

  if (file.dir) {
    return (
      <div style={divStyle}>
        <FaIcon icon='fa-solid fa-folder' style={{ width, height: width }} />
      </div>
    );
  }

  const isImg = FaUtils.isImg(file.type);
  if (isImg) {
    return (
      <div className="fa-flex-row fa-flex-center" style={divStyle}>
        <img src={fileSaveApi.genLocalGetFilePreview(file.fileId)} style={{ maxWidth: width, maxHeight: width }} alt={file.name} />
      </div>
    );
  }

  return (
    <div style={divStyle}>
      <FaIcon icon='fa-solid fa-file-lines' style={{ width, height: width }} />
    </div>
  );
}

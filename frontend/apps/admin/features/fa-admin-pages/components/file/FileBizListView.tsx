import React from 'react';
import type { Admin } from '@features/fa-admin-pages/types';
import FileSaveIcon from './FileSaveIcon';
import { FaUtils } from '@fa/ui';

export interface FileBizListViewProps {
  fileBizList: Admin.FileBiz[];
}

/**
 * {Admin.FileBiz}附件展示列表
 * @author xu.pengfei
 * @date 2023/12/16 09:58
 */
export default function FileBizListView({ fileBizList = [] }: FileBizListViewProps) {
  return (
    <div className="fa-flex-column">
      {fileBizList.map((item) => {
        return (
          <FileSaveIcon
            key={item.id}
            file={{
              id: item.fileId,
              originalFilename: item.fileName,
              ext: FaUtils.getExtension(item.fileName),
            }}
            width={25}
          />
        );
      })}
    </div>
  );
}

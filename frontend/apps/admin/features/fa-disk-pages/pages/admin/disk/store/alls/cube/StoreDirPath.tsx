import React, { useEffect, useState } from 'react';
import { Fa } from '@fa/ui';
import { Disk } from '@/types';
import { storeFileApi } from '@/services';
import { isNil } from 'lodash';
import { Breadcrumb } from 'antd';

export interface StoreDirPathProps {
  dirId: number;
  onClick?: (id: number) => void;
  onGetDirs?: (dirs: Fa.TreeNode<Disk.StoreFile, number>[]) => void;
}

/**
 * @author xu.pengfei
 * @date 2022/12/22 10:47
 */
export default function StoreDirPath({ dirId, onClick, onGetDirs }: StoreDirPathProps) {
  const [dirs, setDirs] = useState<Fa.TreeNode<Disk.StoreFile, number>[]>([]);

  useEffect(() => {
    if (isNil(dirId) || dirId === Fa.Constant.TREE_SUPER_ROOT_ID) {
      setDirs([]);
      return;
    }

    storeFileApi.treePathLine(dirId).then((res) => {
      setDirs(res.data);
      if (onGetDirs) {
        onGetDirs(res.data);
      }
    });
  }, [dirId]);

  function handleClickDir(id: number) {
    if (onClick) {
      onClick(id);
    }
  }

  if (isNil(dirId) || dirId === Fa.Constant.TREE_SUPER_ROOT_ID) {
    return <div>全部文件</div>;
  }
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => handleClickDir(Fa.Constant.TREE_SUPER_ROOT_ID)}>
          <a>全部文件</a>
        </Breadcrumb.Item>
        {dirs.map((i) => (
          <Breadcrumb.Item key={i.id} onClick={() => handleClickDir(i.id)}>
            <a>{i.name}</a>
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );
}

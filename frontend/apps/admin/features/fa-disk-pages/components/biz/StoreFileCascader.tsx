import React, { useContext } from 'react';
import { BaseCascader, BaseCascaderProps } from '@fa/ui';
import { Disk } from '@/types';
import { storeFileApi } from "@/services";
import { DiskContext } from "@/layout";

export interface StoreFileCascaderProps extends Omit<BaseCascaderProps<Disk.StoreFile, number>, 'serviceApi'> {}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function StoreFileCascader(props: StoreFileCascaderProps) {
  const { bucket } = useContext(DiskContext);

  return (
    <BaseCascader<Disk.StoreFile, number>
      showRoot={false}
      serviceApi={{
        ...storeFileApi,
        allTree: () => storeFileApi.getTree({ query: { bucketId: bucket.id } })
      }}
      rootName="全部文件"
      placeholder="请选择目录"
      extraParams={bucket}
      {...props}
    />
  );
}

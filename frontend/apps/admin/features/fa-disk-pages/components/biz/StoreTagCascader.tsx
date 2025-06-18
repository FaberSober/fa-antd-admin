import React, {useContext} from 'react';
import {BaseCascader, BaseCascaderProps} from '@fa/ui';
import { storeTagApi } from '@/services';
import {Disk} from '@/types';
import {DiskContext} from "@/layout";

export interface StoreTagCascaderProps extends Omit<BaseCascaderProps<Disk.StoreTag, number>, 'serviceApi'> {}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function StoreTagCascader(props: StoreTagCascaderProps) {
  const { bucket } = useContext(DiskContext);

  return (
    <BaseCascader
      showRoot={false}
      serviceApi={{
        ...storeTagApi,
        allTree: () => storeTagApi.getTree({ query: { bucketId: bucket.id } })
      }}
      placeholder="请选择标签"
      extraParams={bucket}
      {...props}
    />
  );
}

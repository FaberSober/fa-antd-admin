import React, {useContext} from 'react';
import {BaseTreeSelect, BaseTreeSelectProps} from '@fa/ui';
import { storeTagApi as api } from '@/services';
import {Disk} from '@/types';
import {DiskContext} from "@/layout";

export interface StoreTagTreeSelectProps extends Omit<BaseTreeSelectProps<Disk.StoreTag, number>, 'serviceApi'> {
}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function StoreTagTreeSelect(props: StoreTagTreeSelectProps) {
  const {bucket} = useContext(DiskContext);

  return (
    <BaseTreeSelect
      showRoot={false}
      serviceApi={{
        ...api,
        allTree: () => api.getTree({query: {bucketId: bucket.id}})
      }}
      placeholder="请选择标签"
      extraEffectArgs={[bucket]}
      {...props}
    />
  );
}

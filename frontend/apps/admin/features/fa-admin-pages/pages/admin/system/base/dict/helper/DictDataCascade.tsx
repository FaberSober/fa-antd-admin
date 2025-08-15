import React from 'react';
import { BaseCascader, type BaseCascaderProps } from '@fa/ui';
import type { Admin } from '@/types';
import { dictDataApi as api } from '@features/fa-admin-pages/services';

export interface DictDataCascadeProps extends Omit<BaseCascaderProps<Admin.DictData>, 'serviceApi'> {
  dictId: number;
}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictDataCascade({dictId, ...props}: DictDataCascadeProps) {
  return (
    <BaseCascader
      showRoot
      serviceApi={{
        ...api,
        allTree: () => api.getTree({ query: { dictId } }),
      }}
      {...props}
      extraParams={[dictId]}
    />
  );
}

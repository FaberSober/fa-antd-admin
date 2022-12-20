import React from 'react';
import modelService from '@/services/admin/dict';
import { BaseCascader, BaseCascaderProps } from '@fa/ui';
import { Admin } from '@/types';

export interface DictCascadeProps extends Omit<BaseCascaderProps<Admin.Dict>, 'serviceApi'> {}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictCascade(props: DictCascadeProps) {
  return <BaseCascader showRoot serviceApi={modelService} {...props} />;
}

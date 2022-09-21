import React from 'react';
import modelService from '@/services/admin/dictType';
import BaseCascader, { BaseCascaderProps } from '@/components/base-cascader';
import Admin from '@/props/admin';

export interface DictTypeCascadeProps extends Omit<BaseCascaderProps<Admin.DictType>, 'serviceApi'> {}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictTypeCascade(props: DictTypeCascadeProps) {
  return <BaseCascader showRoot serviceApi={modelService} {...props} />;
}

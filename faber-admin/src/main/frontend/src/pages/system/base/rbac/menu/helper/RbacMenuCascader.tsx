import React from 'react';
import api from '@/services/rbac/rbacMenu';
import BaseCascader, { BaseCascaderProps } from '@/components/biz/base-cascader';
import Rbac from '@/props/rbac';

export interface RbacMenuCascaderProps extends Omit<BaseCascaderProps<Rbac.RbacMenu>, 'serviceApi'> {}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function RbacMenuCascader(props: RbacMenuCascaderProps) {
  return <BaseCascader showRoot={false} serviceApi={api} placeholder="请选择菜单" {...props} />;
}

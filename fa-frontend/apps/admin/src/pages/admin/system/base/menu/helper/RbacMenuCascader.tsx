import React from 'react';
import BaseCascader, {BaseCascaderProps} from '@/components/base-cascader';
import api from '@/services/rbac/rbacMenu';
import * as Rbac from '../../../../../../../types/rbac';

export interface RbacMenuCascaderProps extends Omit<BaseCascaderProps<Rbac.RbacMenu, string>, 'serviceApi'> {}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function RbacMenuCascader(props: RbacMenuCascaderProps) {
  return <BaseCascader showRoot={false} serviceApi={api} placeholder="请选择菜单" {...props} />;
}

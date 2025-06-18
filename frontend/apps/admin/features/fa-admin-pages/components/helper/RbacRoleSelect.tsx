import React from 'react';
import { BaseSelect, type BaseSelectProps } from '@fa/ui';
import type { Rbac } from '@/types';
import { rbacRoleApi as api } from '@features/fa-admin-pages/services';

/**
 * @author xu.pengfei
 * @date 2022/9/28
 */
export default function RbacRoleSelect({ ...props }: Omit<BaseSelectProps<Rbac.RbacRole>, 'serviceApi'>) {
  return <BaseSelect serviceApi={api} placeholder="请选择角色" {...props} />;
}

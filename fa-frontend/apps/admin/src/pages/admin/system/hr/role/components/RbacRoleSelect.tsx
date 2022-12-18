import React from 'react';
import BaseSelect, {BaseSelectProps} from '@/components/base-select';
import api from '@/services/rbac/rbacRole';
import * as Rbac from "@/props/rbac";

/**
 * @author xu.pengfei
 * @date 2022/9/28
 */
export default function RbacRoleSelect({ ...props }: Omit<BaseSelectProps<Rbac.RbacRole>, 'serviceApi'>) {
  return (
    <BaseSelect serviceApi={api} placeholder="请选择角色" {...props} />
  );
}

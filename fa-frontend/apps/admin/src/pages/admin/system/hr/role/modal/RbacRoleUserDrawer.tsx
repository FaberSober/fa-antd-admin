import React, { useState } from 'react';
import { Drawer, DrawerProps } from 'antd';
import { Rbac } from '@/types';
import RbacUserRoleList from '../list/RbacUserRoleList';

export interface RbacRoleUserDrawerProps extends DrawerProps {
  record: Rbac.RbacRole;
  success?: () => void;
}

/**
 * BASE-角色表实体新增、编辑弹框
 */
export default function RbacRoleUserDrawer({ children, record, ...props }: RbacRoleUserDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <span>
      <span onClick={() => setOpen(true)}>{children}</span>
      <Drawer title="角色用户列表" open={open} onClose={() => setOpen(false)} width={700} {...props}>
        <RbacUserRoleList rbacRole={record} />
      </Drawer>
    </span>
  );
}

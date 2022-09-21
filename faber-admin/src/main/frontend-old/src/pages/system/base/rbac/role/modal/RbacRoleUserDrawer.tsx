import React, {useContext, useState} from 'react';
import {Button, Drawer, Space, Tree} from 'antd';
import Rbac from '@/props/rbac';
import {UserContext} from "@/layout/UserSimpleLayout";
import {DragModalProps} from "@/components/modal/DragModal";
import {FaberBase} from "@/props/base";
import rbacMenuApi from "@/services/rbac/rbacMenu";
import rbacRoleMenuApi from "@/services/rbac/rbacRoleMenu";
import {FaFlexRestLayout} from "@/components/base-layout";
import {showResponse} from "@/utils/utils";
import RbacUserRoleList from "@/pages/system/base/rbac/role/list/RbacUserRoleList";


export interface RbacRoleUserDrawerProps extends DragModalProps {
  record: Rbac.RbacRole;
  success?: () => void;
}

/**
 * BASE-角色表实体新增、编辑弹框
 */
export default function RbacRoleUserDrawer({ children, title, record, success, ...props }: RbacRoleUserDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <span>
      <span onClick={() => setOpen(true)}>{children}</span>
      <Drawer
        title="角色用户列表"
        open={open}
        onClose={() => setOpen(false)}
        width={700}
        {...props}
      >
        <div style={{ height: '100%', position: 'relative' }}>
          <div className="faber-full-content-no-padding faber-flex-column">
            <FaFlexRestLayout>
              <RbacUserRoleList />
            </FaFlexRestLayout>
          </div>
        </div>
      </Drawer>
    </span>
  )
}

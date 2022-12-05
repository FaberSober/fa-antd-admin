import React, {useState} from 'react';
import {Drawer} from 'antd';
import Rbac from '@/props/rbac';
import {DragModalProps} from "@/components/modal/DragModal";
import {FaFlexRestLayout} from "@/components/base-layout";
import RbacUserRoleList from "../list/RbacUserRoleList";


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
          <div className="fa-full-content fa-flex-column">
            <FaFlexRestLayout>
              <RbacUserRoleList rbacRole={record} />
            </FaFlexRestLayout>
          </div>
        </div>
      </Drawer>
    </span>
  )
}

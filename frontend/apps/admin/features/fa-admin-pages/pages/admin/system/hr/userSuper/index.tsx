import React from 'react';
import UserList from '../user/cube/UserList';

/**
 * 超级用户管理界面
 * 1. 不区分租户
 * 2. 管理全部用户
 * @author xu.pengfei
 * @date 2026-04-28 15:24:17
 */
export default function UserSuperManage() {
  return (
    <div className="fa-full-content-p12">
      <UserList superMode />
    </div>
  );
}

import React, { useContext } from 'react';
import { UserLayoutContext } from "@features/fa-admin-pages/layout";


/**
 * @author xu.pengfei
 * @date 2023/9/5 19:34
 */
export default function UserInfo() {
  const { user } = useContext(UserLayoutContext)
  return (
    <div>
      <div>username: {user.name}</div>
    </div>
  )
}

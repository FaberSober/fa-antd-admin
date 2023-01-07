import React, { useContext } from 'react';
import { UserLayoutContext } from "@features/fa-admin-pages/layout";

/**
 * @author xu.pengfei
 * @date 2022/9/22 20:45
 */
export default function index() {
  const { user } = useContext(UserLayoutContext);
  return <div>Hello, {user.name}!</div>;
}

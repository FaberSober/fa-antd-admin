import React, {useContext} from 'react';
import {UserLayoutContext} from "@/layout/UserLayout";

/**
 * phpRedisAdmin
 * @author xu.pengfei
 * @date 2022/11/29
 */
export default function redis() {
  const {systemConfig} = useContext(UserLayoutContext)
  return (
    <iframe src={systemConfig.phpRedisAdmin} className="fa-full-content" style={{ width: '100%', height: '100%', border: 'none', margin: 0 }} />
  )
}

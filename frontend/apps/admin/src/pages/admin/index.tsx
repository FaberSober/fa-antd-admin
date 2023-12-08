import React, {useContext, useEffect} from 'react';
import {UserLayoutContext} from "@/layout";
import {SITE_INFO} from "@/configs";
import {useNavigate} from "react-router-dom";


/**
 * @author xu.pengfei
 * @date 2022/9/22 20:45
 */
export default function AdminIndex() {
  const { user } = useContext(UserLayoutContext);
  const navigate = useNavigate();

  useEffect(() => {
    navigate(SITE_INFO.HOME_LINK);
    // addTab({
    //   key: 'home',
    //   path: '/admin/home/desktop',
    //   name: '首页', // 名称
    //   type: 'inner', // 打开页面类型，默认为inner
    //   closeable: false, // 是否可以关闭/** 图标标识 */
    //   icon: <HomeOutlined />
    // })
  }, [])

  return <div>Hello, {user.name}!</div>;
}

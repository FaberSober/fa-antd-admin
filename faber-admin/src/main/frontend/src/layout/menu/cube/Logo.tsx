import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import styles from "@/layout/menu/MenuLayout.module.less";
import {UserLayoutContext} from "@/layout/UserLayout";

/**
 * @author xu.pengfei
 * @date 2022/9/23
 */
export default function Logo() {
  const { systemConfig } = useContext(UserLayoutContext)
  return (
    <Link to="/" className={styles.logo}>
      <img src={systemConfig.logo} alt="logo" className={styles.logoImg} />
      <span className={styles.logoTitle}>
        {systemConfig.title}
      </span>
    </Link>
  )
}

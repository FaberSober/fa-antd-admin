import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import styles from "@/layout/menu/MenuLayout.module.less";
import {UserLayoutContext} from "@/layout/UserLayout";
import {SITE_INFO} from "@/configs/server.config";
import fileSaveApi from '@/services/admin/fileSave'


/**
 * @author xu.pengfei
 * @date 2022/9/23
 */
export default function Logo() {
  const { systemConfig } = useContext(UserLayoutContext)
  return (
    <Link to={SITE_INFO.HOME_LINK} className={styles.logo}>
      <img src={fileSaveApi.genLocalGetFile(systemConfig.logo)} alt="logo" className={styles.logoImg} />
      <span className={styles.logoTitle}>
        {systemConfig.title}
      </span>
    </Link>
  )
}

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SITE_INFO } from '@/configs';
import { fileSaveApi } from '@features/fa-admin-pages/services';
import { ConfigLayoutContext } from '../../config/context/ConfigLayoutContext';

/**
 * @author xu.pengfei
 * @date 2022/9/23
 */
export default function Logo() {
  const { systemConfig } = useContext(ConfigLayoutContext);
  return (
    <Link to={SITE_INFO.HOME_LINK} className="fa-menu-logo">
      <img src={fileSaveApi.genLocalGetFile(systemConfig.logo)} alt="logo" className="fa-menu-logo-img" />
      <span className="fa-menu-logo-title">{systemConfig.title}</span>
    </Link>
  );
}

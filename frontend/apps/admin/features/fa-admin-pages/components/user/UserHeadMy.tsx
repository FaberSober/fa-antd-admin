import UserLayoutContext from '@features/fa-admin-pages/layout/user/context/UserLayoutContext';
import { fileSaveApi } from '@features/fa-admin-pages/services';
import { Avatar } from 'antd';
import React, { useContext } from 'react';

/**
 * @author xu.pengfei
 * @date 2025-09-07 17:12:42
 */
export default function UserHeadMy() {
  const { user } = useContext(UserLayoutContext);

  return (
    <Avatar size="small" src={<img src={fileSaveApi.genLocalGetFilePreview(user.img)} alt={user.name} />} />
  );
}

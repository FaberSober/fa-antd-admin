import React, { useContext } from 'react';
import { Avatar, type AvatarProps } from 'antd';
import { fileSaveApi } from '@features/fa-admin-pages/services';
import UserLayoutContext from '../../user/context/UserLayoutContext';

/**
 * 用户头像+用户名
 */
export default function UserAvatarImage(props: AvatarProps) {
  const { user } = useContext(UserLayoutContext);

  return <Avatar src={<img src={fileSaveApi.genLocalGetFilePreview(user.img)} alt={user.name} />} {...props} />;
}

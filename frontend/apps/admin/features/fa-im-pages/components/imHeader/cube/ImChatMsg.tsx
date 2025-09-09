import { UserLayoutContext } from '@features/fa-admin-pages/layout';
import { fileSaveApi } from '@features/fa-admin-pages/services';
import { Im } from '@features/fa-im-pages/types';
import { Avatar } from 'antd';
import React, { useContext } from 'react';

export interface ImChatMsgProps {
  msg: Im.ImMessageShow;
}

/**
 * @author xu.pengfei
 * @date 2025-09-09 10:33:38
 */
export default function ImChatMsg({ msg }: ImChatMsgProps) {
  const {user} = useContext(UserLayoutContext)

  // send by me
  if (msg.senderId === user.id) {
    return (
      <div className='fa-flex-row-center fa-im-wx-msg-item'>
        <div style={{minWidth: 100, flex: 1}}></div>
        <div className='fa-mr12 fa-im-wx-msg-me'>{msg.content}</div>
        <Avatar shape="square" src={<img src={fileSaveApi.genLocalGetFilePreview(msg.senderUserImg)} alt={msg.crtName} />} className='fa-im-wx-msg-header' />
      </div>
    )
  }

  return (
    <div className='fa-flex-row-center fa-im-wx-msg-item'>
      <Avatar shape="square" src={<img src={fileSaveApi.genLocalGetFilePreview(msg.senderUserImg)} alt={msg.crtName} />} className='fa-im-wx-msg-header' />
      <div className='fa-ml12 fa-im-wx-msg'>{msg.content}</div>
      <div style={{minWidth: 100, flex: 1}}></div>
    </div>
  );
}

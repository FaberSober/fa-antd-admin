import { UserLayoutContext } from '@features/fa-admin-pages/layout';
import { fileSaveApi } from '@features/fa-admin-pages/services';
import { Im } from '@features/fa-im-pages/types';
import { Avatar, Popover } from 'antd';
import React, { useContext } from 'react';
import ImChatMsgContent from './ImChatMsgContent';
import ImUserView from './ImUserView';

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
        <div className='fa-mr12 fa-im-wx-msg-me'>
          <ImChatMsgContent msg={msg} />
        </div>
        <Avatar shape="square" src={<img src={fileSaveApi.genLocalGetFilePreview(msg.senderUserImg)} alt={msg.crtName} />} className='fa-im-wx-msg-header' size={36} />
      </div>
    )
  }

  // send by others
  return (
    <div className='fa-flex-row fa-im-wx-msg-item'>
      <Popover content={<ImUserView userId={msg.senderId} />} trigger="click" placement='rightTop'>
        <Avatar shape="square" src={<img src={fileSaveApi.genLocalGetFilePreview(msg.senderUserImg)} alt={msg.crtName} />} className='fa-im-wx-msg-header' size={36} />
      </Popover>

      <div className='fa-ml12'>
        <div className='fa-im-wx-msg-other-sender-name'>{msg.crtName}</div>
        <div className='fa-im-wx-msg'>
          <ImChatMsgContent msg={msg} />
        </div>
      </div>
      <div style={{minWidth: 100, flex: 1}}></div>
    </div>
  );
}

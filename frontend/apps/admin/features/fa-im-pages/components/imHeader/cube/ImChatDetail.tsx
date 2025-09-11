import { PlusOutlined } from '@ant-design/icons';
import { BaseDrawerContext, BizUserSelect, FaUtils, SelectedUser } from '@fa/ui';
import { fileSaveApi } from '@features/fa-admin-pages/services';
import { imConversationApi } from '@features/fa-im-pages/services';
import { Im, ImEnums } from '@features/fa-im-pages/types';
import { Avatar, Tooltip } from 'antd';
import React, { useContext, useEffect, useState } from 'react';

export interface ImChatDetailProps {
  conv: Im.ImConversationRetVo;
  onCreateNewConv?: (nconv: Im.ImConversation) => void;
  onUpdateConv?: (nconv: Im.ImConversation) => void;
}

/**
 * chat detail panel:
 * 1. show chat participants list;
 * 2. add user;
 * 3. remove user;
 * @author xu.pengfei
 * @date 2025-09-11 11:12:45
 */
export default function ImChatDetail({ conv, onCreateNewConv, onUpdateConv }: ImChatDetailProps) {
  const {closeDrawer} = useContext(BaseDrawerContext)
  const [showAll, setShowAll] = useState(false);
  const [users, setUsers] = useState<Im.ImParticipant[]>([]);

  useEffect(() => {
    getParticipants()
  }, [conv]);

  function getParticipants() {
    imConversationApi.getParticipant({ conversationId: conv.id, limit: showAll ? 999 : 15 }).then(res => {
      setUsers(res.data)
    })
  }

  /** 群聊添加用户 */
  function handleAddUsers(users: SelectedUser[], callback: any, error: any) {
    // console.log('handleAddUsers', users)
    const userIds = users.map(i => i.id)
    // 如果是单聊，则创建一个新的群聊
    if (conv.type == ImEnums.ImConversationTypeEnum.SINGLE) {
      imConversationApi.createNewGroup({ userIds }).then(res => {
        FaUtils.showResponse(res, '创建群聊')
        onCreateNewConv?.(res.data)
        callback();
        // 创建新的群聊成功，关闭聊天详情drawer，设置选中最新创建的聊天
        closeDrawer?.();
      }).catch(() => callback())
    } else {
      // 如果是群聊，则添加用户
      // 过滤已经加入的用户
      const inUserIds = getConvUsers(conv).map(i => i.id);
      const addUserIds = userIds.filter(i => !inUserIds.includes(i))
      imConversationApi.addGroupUsers({ userIds: addUserIds, conversationId: conv.id }).then(res => {
        FaUtils.showResponse(res, '添加群聊用户')
        onUpdateConv?.(res.data)
        getParticipants()
        callback();
      }).catch(() => callback())
      callback();
    }
  }

  function getConvUsers(conv: Im.ImConversationRetVo):{id:string,name:string,img:string}[] {
    // return JSON.parse(conv.cover)
    return users.map(i => ({ id: i.userId, name: i.name, img: i.img }));
  }

  return (
    <div className='fa-full-content'>
      <div className='fa-flex-row fa-flex-wrap fa-p12' style={{gap: 12}}>
        {/* 展示参与聊天的用户列表， TOOD 默认展示15个用户，点击查看更多，展示全部用户 */}
        {getConvUsers(conv).map((item) => {
          return (
            <div key={item.id} className='fa-flex-column-center fa-base-btn' style={{padding: 2, borderRadius: 2}}>
              <Avatar shape="square" src={<img src={fileSaveApi.genLocalGetFilePreview(item.img)} />} size={36} />
              <Tooltip title={item.name} placement='bottom'>
                <div className='fa-word-ellipse fa-text-center' style={{fontSize: '11px', width: 40, marginTop: 2}}>{item.name}</div>
              </Tooltip>
            </div>
          )
        })}
        {/* 添加用户按钮 */}
        <div className='fa-flex-column-center' style={{padding: 2, borderRadius: 2}}>
          <BizUserSelect onChange={handleAddUsers} selectedUsers={getConvUsers(conv).map(i => ({ id: i.id, allowRemove: false }))}>
            <div className='fa-im-wx-conv-add-user-btn fa-base-btn'>
              <PlusOutlined style={{fontSize: '16px'}} />
            </div>
          </BizUserSelect>
        </div>
        {/* TODO 移除用户按钮 */}

        <div className='fa-flex-center fa-full-w'>
          <div style={{fontSize: '12px', padding: '2px 6px'}} className='fa-base-btn fa-radius'>查看更多</div>
        </div>
      </div>
    </div>
  );
}

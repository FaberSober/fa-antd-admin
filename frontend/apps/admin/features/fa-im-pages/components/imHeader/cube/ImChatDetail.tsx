import { UserLayoutContext } from '@/layout';
import { DownOutlined, MinusOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import { BaseDrawerContext, BizUserSelect, FaUtils, SelectedUser } from '@fa/ui';
import { RemoveUserListModal } from '@features/fa-admin-pages/components';
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
  const {user} = useContext(UserLayoutContext)
  const {closeDrawer} = useContext(BaseDrawerContext)
  const [showAll, setShowAll] = useState(false);
  const [users, setUsers] = useState<Im.ImParticipant[]>([]);
  const [userTotal, setUserTotal] = useState(0);

  const showUserNum = 15; // 如果普通用户，则展示15个，如果是群管理员，则展示14个用户

  useEffect(() => {
    getParticipants()
  }, [conv]);

  function getParticipants() {
    imConversationApi.getParticipant({ query: { conversationId: conv.id }, pageSize: 999 }).then(res => {
      setUsers(res.data.rows)
      setUserTotal(res.data.pagination.total)
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
      const inUserIds = getAllUsers().map(i => i.id);
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

  function handleRemoveUsers(removeUserList: SelectedUser[]) {
    console.log('removeUserList', removeUserList)
    const userIds = removeUserList.map(i => i.id)
    return imConversationApi.removeGroupUsers({ conversationId: conv.id, userIds }).then(res => {
      FaUtils.showResponse(res, '移出用户')
      getParticipants()
      onUpdateConv?.(res.data)
    })
  }

  function getShowUsers() {
    return users.map(i => ({ id: i.userId, name: i.name, img: i.img }));
  }

  function getAllUsers() {
    return users.map(i => ({ id: i.userId, name: i.name, img: i.img }));
  }

  function handleToggleViewMore() {
    setShowAll(!showAll)
  }

  return (
    <div className='fa-full-content'>
      <div className='fa-flex-row fa-flex-wrap fa-p12' style={{gap: 12}}>
        {/* 展示参与聊天的用户列表， TOOD 默认展示15个用户，点击查看更多，展示全部用户 */}
        {getShowUsers().map((item) => {
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
          <BizUserSelect onChange={handleAddUsers} selectedUsers={getAllUsers().map(i => ({ id: i.id, allowRemove: false }))}>
            <div className='fa-im-wx-conv-add-user-btn fa-base-btn'>
              <PlusOutlined style={{fontSize: '16px'}} />
            </div>
          </BizUserSelect>
        </div>
        {/* 移除用户按钮 */}
        {conv.managerId === user.id && (
          <div className='fa-flex-column-center' style={{padding: 2, borderRadius: 2}}>
            <RemoveUserListModal userList={getAllUsers().filter(i => i.id !== user.id)} onRemove={handleRemoveUsers}>
              <div className='fa-im-wx-conv-add-user-btn fa-base-btn'>
                <MinusOutlined style={{fontSize: '16px'}} />
              </div>
            </RemoveUserListModal>
          </div>
        )}

        {userTotal > showUserNum && (
          <div className='fa-flex-center fa-full-w'>
            <div onClick={handleToggleViewMore} style={{fontSize: '12px', padding: '2px 6px'}} className='fa-base-btn fa-radius'>
              {showAll ? (
                <div className='fa-flex-row-center'>收起<UpOutlined /></div>
              ) : (
                <div className='fa-flex-row-center'>查看更多<DownOutlined /></div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

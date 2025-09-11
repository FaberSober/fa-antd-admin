import { MessageOutlined } from '@ant-design/icons';
import { Admin, ApiEffectLayoutContext, fileSaveApi, PageLoading } from '@fa/ui';
import { userApi } from '@features/fa-admin-pages/services';
import { imConversationApi } from '@features/fa-im-pages/services';
import { Im } from '@features/fa-im-pages/types';
import { Avatar, Button } from 'antd';
import { isNil } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { dispatch } from 'use-bus';

export interface ImUserViewProps {
  userId: string;
  onCreateNewSingle?: (conversation: Im.ImConversation) => void;
}

/**
 * @author xu.pengfei
 * @date 2025-09-11 21:05:11
 */
export default function ImUserView({ userId, onCreateNewSingle }: ImUserViewProps) {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const [user, setUser] = useState<Admin.UserWeb>();

  useEffect(() => {
    userApi.getDetail(userId).then(res => {
      setUser(res.data)
    })
  }, [userId]);

  function handleCreateNewSingle() {
    if (isNil(user)) return;
    imConversationApi.createNewSingle({ toUserId: user.id }).then(res => {
      onCreateNewSingle?.(res.data)
      dispatch({ type: '@@event/CREATE_NEW_SINGLE', payload: {...res.data, unreadCount: 0, convTitle: user.name} })
    })
  }

  if (isNil(user)) return <PageLoading />

  const loading = loadingEffect[imConversationApi.getUrl('createNewSingle')];
  return (
    <div className='fa-flex-center'>
      <div className='fa-flex-column'>
        <div className='fa-flex-row'>
          <Avatar shape="square" src={<img src={fileSaveApi.genLocalGetFilePreview(user.img)} alt={user.name} />} size={50} />

          <div className='fa-ml12'>
            <div className='fa-h3'>{user.name}</div>
            <div>部门：{user.departmentName}</div>
            <div>手机：{user.tel}</div>
          </div>
        </div>

        <div className='fa-flex-row'>
          <Button loading={loading} onClick={handleCreateNewSingle} icon={<MessageOutlined />}>
            发消息
          </Button>
        </div>
      </div>
    </div>
  );
}

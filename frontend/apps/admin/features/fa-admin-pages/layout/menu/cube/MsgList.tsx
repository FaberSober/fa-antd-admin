import React, { type CSSProperties, useContext, useEffect, useState } from 'react';
import { fileSaveApi, msgApi } from '@features/fa-admin-pages/services';
import type { Admin } from '@/types';
import { Avatar, List } from 'antd';
import { get } from 'lodash';
import { ApiEffectLayoutContext } from '@fa/ui';
import UserLayoutContext from '../../user/context/UserLayoutContext';
import MenuLayoutContext from '../context/MenuLayoutContext';

interface MsgListProps {
  onClose?: () => void;
}

/**
 * 消息列表
 * @param onClose
 * @constructor
 */
export default function MsgList({ onClose }: MsgListProps) {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);

  const { unreadCount, refreshUnreadCount } = useContext(UserLayoutContext);
  const { addTab } = useContext(MenuLayoutContext);

  const [data, setData] = useState<Admin.Msg[]>([]);

  useEffect(() => {
    fetchMsgList();
  }, [unreadCount]);

  function fetchMsgList() {
    msgApi.pageMine({ pageSize: 10, query: { isRead: false }, sorter: 'id DESC' }).then((res) => {
      setData(res.data.rows);
      refreshUnreadCount();
    });
  }

  function handleReadOne(id: string) {
    msgApi.batchRead([id]).then(() => {
      refreshUnreadCount();
      // fetchMsgList();
    });
  }

  function handleOpenMsgTag() {
    addTab({
      key: 'msg',
      path: '/admin/system/account/msg',
      name: '消息中心',
    });
    if (onClose) onClose();
  }

  const bottomLink: CSSProperties = {
    width: '100%',
    padding: '12px 0',
    textAlign: 'center',
    display: 'inline-block',
    borderTop: '1px solid #eee',
  };

  const loading = loadingEffect[msgApi.getUrl('pageMine')];
  return (
    <div style={{ width: 400, maxHeight: 400, overflowY: 'auto', padding: '0 12px' }}>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar size="small" src={fileSaveApi.genLocalGetFilePreview(get(item, 'fromUser.img')!)} />}
              title={<a onClick={() => handleReadOne(item.id)}>{get(item, 'content')}</a>}
              // description={get(item, 'content')}
            />
          </List.Item>
        )}
        loading={loading}
      />
      <a onClick={handleOpenMsgTag} style={bottomLink}>
        查看更多
      </a>
    </div>
  );
}

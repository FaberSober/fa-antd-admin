import { MessageOutlined } from '@ant-design/icons';
import { BaseDrawer } from '@fa/ui';
import { Badge, Tooltip } from 'antd';
import { useEffect, useState, useRef } from 'react';
import './ImHeaderCube.scss'
import ImChatPanel from './cube/ImChatPanel';
import { imConversationApi } from '@features/fa-im-pages/services';
import useBus from 'use-bus';


/**
 * @author xu.pengfei
 * @date 2025-09-07 20:57:56
 */
export default function ImHeaderCube() {
  const [unreadCount, setUnreadCount] = useState(0);
  const audioRef = useRef(new Audio('/file/audio/notify.mp3'));

  useEffect(() => {
    getUnreadCount()
  }, []);

  function getUnreadCount() {
    imConversationApi.getUnreadCount().then(res => {
      setUnreadCount(res.data)
    })
  }

  // 接收消息
  useBus(
    ['@@ws/RECEIVE/IM'],
    ({  }) => {
      // 接收到消息，给出音效提醒
      audioRef.current.play().catch(console.error);
      getUnreadCount()
    },
    [],
  )

  // 刷新消息未读数量
  useBus(
    ['@@api/IM_REFRESH_UNREAD_COUNT'],
    ({  }) => {
      getUnreadCount()
    },
    [],
  )

  return (
    <>
      <BaseDrawer
        title="内部聊天"
        triggerDom={(
          <Tooltip title="内部聊天">
            <div className="fa-link-primary fa-flex-center" style={{ width: 44 }}>
              <a className="fa-menu-normal-cube">
                <Badge size="small" count={unreadCount}>
                  <MessageOutlined className="fa-menu-normal-cube" style={{ margin: '0 4px' }} />
                </Badge>
              </a>
            </div>
          </Tooltip>
        )}
        width={1000}
      >
        <ImChatPanel />
      </BaseDrawer>
    </>
  );
}

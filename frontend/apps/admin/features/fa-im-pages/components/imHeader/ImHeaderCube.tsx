import { MessageOutlined } from '@ant-design/icons';
import { BaseDrawer } from '@fa/ui';
import { Badge, Tooltip } from 'antd';
import { useState } from 'react';
import './ImHeaderCube.scss'
import ImChatPanel from './cube/ImChatPanel';

/**
 * @author xu.pengfei
 * @date 2025-09-07 20:57:56
 */
export default function ImHeaderCube() {
  const [unreadCount] = useState(0);
  return (
    <>
      <BaseDrawer
        title="内部聊天"
        triggerDom={(
          <Tooltip title="内部聊天">
            <div className="fa-link-grey fa-flex-center" style={{ width: 44 }}>
              <a className="fa-menu-normal-cube">
                <Badge size="small" count={unreadCount}>
                  <MessageOutlined className="fa-menu-normal-cube" style={{ margin: '0 4px' }} />
                </Badge>
              </a>
            </div>
          </Tooltip>
        )}
      >
        <ImChatPanel />
      </BaseDrawer>
    </>
  );
}

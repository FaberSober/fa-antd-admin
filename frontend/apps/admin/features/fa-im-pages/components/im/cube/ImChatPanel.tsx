import FaIconPro from '@features/fa-admin-pages/components/icons/FaIconPro';
import { UserLayoutContext } from '@/layout';
import { CloseOutlined, MessageOutlined } from '@ant-design/icons';
import { FaFlexRestLayout } from '@fa/ui';
import { Badge, Tabs } from 'antd';
import { useContext } from 'react';

export interface ImChatPanelProps {
  onClose?: () => void;
}

/**
 * @author xu.pengfei
 * @date 2025-09-07 20:31:54
 */
export default function ImChatPanel({ onClose }: ImChatPanelProps) {
  const {user} = useContext(UserLayoutContext)

  function handleClickClose() {
    onClose?.();
  }

  return (
    <div className='fa-im-chat-panel fa-box-shadow fa-flex-column'>
      {/* title */}
      <div className='fa-im-chat-panel-title'>
        <div className='fa-flex-row-center'>
          <div className='fa-p12'>{user.name}</div>
          <div className='fa-p12'>
            <Badge status="success" text="在线" />
          </div>
          <div className='fa-flex-1'></div>
          <div className='fa-p12 fa-flex-center fa-hover' onClick={handleClickClose}>
            <CloseOutlined />
          </div>
        </div>

        <div className='fa-tabs'>
          <Tabs
            defaultActiveKey="1"
            items={[
              { label: <div style={{width: 129}} className='fa-flex-center'><MessageOutlined /></div>, key: 'chat'  },
              { label: <div style={{width: 129}} className='fa-flex-center'><FaIconPro icon="fa-solid fa-user-group" /></div>, key: 'users'  },
            ]}
            tabBarGutter={0}
          />
        </div>
      </div>

      {/* content */}
      <FaFlexRestLayout>
        content
      </FaFlexRestLayout>

      {/* bottom tab */}
      <div className='fa-im-chat-panel-bottom'></div>
    </div>
  );
}

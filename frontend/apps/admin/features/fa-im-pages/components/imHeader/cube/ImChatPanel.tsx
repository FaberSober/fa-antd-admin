import { FaIconPro, UserHeadMy } from '@/components';
import { Im } from '@/types';
import { MessageOutlined } from '@ant-design/icons';
import { FaFlexRestLayout } from '@fa/ui';
import clsx from 'clsx';
import { useState } from 'react';
import ImChatMsgPanel from './ImChatMsgPanel';
import ImChatUserPanel from './ImChatUserPanel';


/**
 * 防微信聊天界面
 * @author xu.pengfei
 * @date 2025-09-07 21:06:38
 */
export default function ImChatPanel() {
  const [menu, setMenu] = useState('msg')

  function handleCreateNewSingle(conversation: Im.ImConversation) {
    setMenu('msg')
  }

  return (
    <div className='fa-im-wx-panel-main fa-flex-row fa-full-content'>
      {/* left menu */}
      <div className='fa-flex-column fa-p6 fa-im-wx-panel-left'>
        <div className='fa-im-wx-panel-left-btn'>
          <UserHeadMy />
        </div>
        <div className={clsx('fa-im-wx-panel-left-btn', menu === 'msg' && 'fa-im-wx-panel-left-btn-selected')} onClick={() => setMenu('msg')}>
          <MessageOutlined />
        </div>
        <div className={clsx('fa-im-wx-panel-left-btn', menu === 'user' && 'fa-im-wx-panel-left-btn-selected')} onClick={() => setMenu('user')}>
          <FaIconPro icon="fa-solid fa-address-book" />
        </div>
      </div>

      <FaFlexRestLayout>
        {menu === 'msg' && <ImChatMsgPanel />}
        {menu === 'user' && <ImChatUserPanel onCreateNewSingle={handleCreateNewSingle} />}
      </FaFlexRestLayout>
    </div>
  );
}

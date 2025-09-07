import { UserHeadMy } from '@/components';
import { MessageOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import clsx from 'clsx';
import { FaIcon } from '@fa/icons';
import { FaFlexRestLayout } from '@fa/ui';
import { Splitter } from 'antd';


/**
 * 防微信聊天界面
 * @author xu.pengfei
 * @date 2025-09-07 21:06:38
 */
export default function ImChatPanel() {
  const [menu, setMenu] = useState('msg')

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
          <FaIcon icon="fa-solid fa-address-book" />
        </div>
      </div>

      <FaFlexRestLayout>
        <Splitter style={{ height: '100%', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          {/* left item */}
          <Splitter.Panel defaultSize={260} min={240} max="70%">
            <div className='fa-im-wx-panel-left-sub'>

            </div>
          </Splitter.Panel>

          {/* right main content */}
          <Splitter.Panel>
            <div className='fa-im-wx-panel-right'>Second</div>
          </Splitter.Panel>
        </Splitter>
      </FaFlexRestLayout>
    </div>
  );
}

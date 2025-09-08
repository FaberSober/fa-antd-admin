import { Splitter } from 'antd';
import React from 'react';

/**
 * @author xu.pengfei
 * @date 2025-09-08 14:18:22
 */
export default function ImChatMsgPanel() {
  return (
    <Splitter style={{ height: '100%' }}>
      {/* left item */}
      <Splitter.Panel defaultSize={260} min={240} max="70%">
        <div className='fa-im-wx-panel-left-sub'>
          conversation list
        </div>
      </Splitter.Panel>

      {/* right main content */}
      <Splitter.Panel>
        <div className='fa-im-wx-panel-right'>Second</div>
      </Splitter.Panel>
    </Splitter>
  );
}

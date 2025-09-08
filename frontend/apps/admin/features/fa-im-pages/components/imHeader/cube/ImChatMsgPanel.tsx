import { Im } from '@/types';
import { imConversationApi } from '@features/fa-im-pages/services';
import { Splitter } from 'antd';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

/**
 * @author xu.pengfei
 * @date 2025-09-08 14:18:22
 */
export default function ImChatMsgPanel() {
  const [convList, setConvList] = useState<Im.ImConversation[]>([]);
  const [convSel, setConvSel] = useState<Im.ImConversation>();

  function getConvList() {
    imConversationApi.listQuery({}).then(res => {
      setConvList(res.data)
    })
  }

  useEffect(() => {
    getConvList();
  }, []);

  return (
    <Splitter style={{ height: '100%' }}>
      {/* left item */}
      <Splitter.Panel defaultSize={260} min={240} max="70%">
        <div className='fa-im-wx-panel-left-sub fa-flex-column'>
          {convList.map(conv => {
            return (
              <div key={conv.id} className={clsx('fa-flex-row-center fa-base-btn fa-p12', convSel?.id === conv.id && 'fa-im-wx-item-selected')} onClick={() => setConvSel(conv)}>
                {/* <Avatar shape="square" src={<img src={fileSaveApi.genLocalGetFilePreview(user.img)} alt={user.name} />} /> */}
                <div className='fa-ml12'>{conv.title}</div>
              </div>
            )
          })}
        </div>
      </Splitter.Panel>

      {/* right main content */}
      <Splitter.Panel>
        <div className='fa-im-wx-panel-right'>Second</div>
      </Splitter.Panel>
    </Splitter>
  );
}

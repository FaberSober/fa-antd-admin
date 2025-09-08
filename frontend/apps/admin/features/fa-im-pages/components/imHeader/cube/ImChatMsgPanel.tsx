import { Im } from '@/types';
import { FolderOutlined, MessageOutlined, SearchOutlined, SmileOutlined } from '@ant-design/icons';
import { FaFlexRestLayout } from '@fa/ui';
import { imConversationApi } from '@features/fa-im-pages/services';
import { Button, Empty, Input, Space, Splitter } from 'antd';
import clsx from 'clsx';
import { isNil } from 'lodash';
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

  function handleSendMsg() {
    if (isNil(convSel)) return;
  }

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
        {
          convSel ? (
            <div className='fa-im-wx-panel-right fa-flex-column'>
              {/* title */}
              <div className='fa-flex-row-center fa-p12 fa-border-b'>
                <div>{convSel.title}</div>
              </div>
              <FaFlexRestLayout>
                <Splitter layout="vertical">
                  {/* msg list */}
                  <Splitter.Panel>
                    <div className='fa-full fa-relative'>msg list</div>
                  </Splitter.Panel>

                  {/* bottom tool & input */}
                  <Splitter.Panel defaultSize={200} max={260} min={120}>
                    <div className='fa-full fa-flex-column fa-p12'>
                      <Space>
                        <Button type="text" icon={<SmileOutlined />} />
                        <Button type="text" icon={<FolderOutlined />} />
                        <Button type="text" icon={<MessageOutlined />} />
                      </Space>

                      <Input.TextArea variant="borderless" style={{resize: 'none', flex: 1}} />
                    </div>
                  </Splitter.Panel>
                </Splitter>
              </FaFlexRestLayout>
            </div>
          ) : <Empty />
        }
      </Splitter.Panel>
    </Splitter>
  );
}

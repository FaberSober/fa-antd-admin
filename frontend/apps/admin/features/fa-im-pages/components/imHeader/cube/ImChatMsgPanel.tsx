import { Im } from '@/types';
import { FolderOutlined, MessageOutlined, SmileOutlined } from '@ant-design/icons';
import { FaFlexRestLayout } from '@fa/ui';
import { imConversationApi } from '@features/fa-im-pages/services';
import { Button, Empty, Input, Space, Splitter } from 'antd';
import clsx from 'clsx';
import { isNil } from 'lodash';
import { useEffect, useState } from 'react';

/**
 * @author xu.pengfei
 * @date 2025-09-08 14:18:22
 */
export default function ImChatMsgPanel() {
  const [convList, setConvList] = useState<Im.ImConversation[]>([]);
  const [convSel, setConvSel] = useState<Im.ImConversation>();
  const [messageText, setMessageText] = useState<string>('');

  function getConvList() {
    imConversationApi.listQuery({}).then(res => {
      setConvList(res.data)
    })
  }

  useEffect(() => {
    getConvList();
  }, []);

  function handleSendMsg() {
    if (isNil(convSel) || !messageText.trim()) return;

    // TODO: 实现发送消息逻辑
    console.log('发送消息:', messageText, '到会话:', convSel.id);

    // 发送后清空输入框
    setMessageText('');
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

                      <Input.TextArea
                        variant="borderless"
                        style={{resize: 'none', flex: 1}}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMsg();
                          }
                        }}
                        placeholder="输入消息，回车发送，Shift+回车换行"
                      />
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

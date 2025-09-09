import { FolderOutlined, MessageOutlined, SmileOutlined } from '@ant-design/icons';
import { FaFlexRestLayout, FaUtils } from '@fa/ui';
import { UserLayoutContext } from '@features/fa-admin-pages/layout';
import { imConversationApi, imMessageApi } from '@features/fa-im-pages/services';
import { Im, ImEnums } from '@features/fa-im-pages/types';
import { Button, Empty, Input, Space, Splitter } from 'antd';
import clsx from 'clsx';
import { isNil } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import ImChatMsg from './ImChatMsg';
import useBus from 'use-bus';

/**
 * @author xu.pengfei
 * @date 2025-09-08 14:18:22
 */
export default function ImChatMsgPanel() {
  const {user} = useContext(UserLayoutContext)
  const [convList, setConvList] = useState<Im.ImConversation[]>([]);
  const [convSel, setConvSel] = useState<Im.ImConversation>();
  const [messageText, setMessageText] = useState<string>('');
  const [msgList, setMsgList] = useState<Im.ImMessageShow[]>([]);

  function getConvList() {
    imConversationApi.listQuery({}).then(res => {
      setConvList(res.data)
    })
  }

  useEffect(() => {
    getConvList();
  }, []);

  function handleClickConv(conv: Im.ImConversation) {
    setConvSel(conv)
    imMessageApi.pageQuery({ query: { conversationId: conv.id }, order: 'id DESC', pageSize: 40 }).then(res => {
      setMsgList(res.data.rows.map(i => ({ ...i, sending: false })))
    })
  }

  function handleSendMsg() {
    if (isNil(convSel) || !messageText.trim()) return;

    // 发送后清空输入框
    setMessageText('');
    const id = FaUtils.uuid()
    const msgTmp = {
      id,
      conversationId: convSel.id,
      senderId: user.id,
      senderUserImg: user.img,
      type: ImEnums.ImMessageTypeEnum.TEXT,
      content: messageText,
      isWithdrawn: false,
    }
    setMsgList([
      ...msgList,
      {
        ...msgTmp,
        sending: true
      }
    ])

    // 实现发送消息逻辑
    console.log('发送消息:', messageText, '到会话:', convSel.id);
    imConversationApi.sendMsg({
      conversationId: convSel.id,
      content: messageText,
      type: ImEnums.ImMessageTypeEnum.TEXT,
    }).then(res => {
      // 发送成功后更新会话列表
      console.log('发送成功:', res.data);
      setMsgList([
        ...msgList,
        {
          ...res.data,
          sending: false,
        }
      ])
    }).catch(err => {
      console.log('发送失败:', err);
      setMsgList([
        ...msgList,
        {
          ...msgTmp,
          sending: false,
          error: '发送失败:' + err.message,
        }
      ])
    })
  }

  // 接收消息
  useBus(
    ['@@ws/RECEIVE/IM'],
    ({ type, payload }) => {
      console.log('FlowTaskCube.received', type, payload)
      const data = payload as Im.ImMessageShow;
      if (`${data.conversationId}` === convSel?.id) {
        setMsgList([
          ...msgList,
          {
            ...data,
            sending: false,
            error: '',
          }
        ])
      }
    },
    [convSel, msgList],
  )

  return (
    <Splitter style={{ height: '100%' }}>
      {/* left item */}
      <Splitter.Panel defaultSize={260} min={240} max="70%">
        <div className='fa-im-wx-panel-left-sub fa-flex-column'>
          {convList.map(conv => {
            return (
              <div key={conv.id} className={clsx('fa-flex-row-center fa-base-btn fa-p12', convSel?.id === conv.id && 'fa-im-wx-item-selected')} onClick={() => handleClickConv(conv)}>
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
                    <div className='fa-full fa-relative fa-flex-column'>
                      {msgList.map(msg => {
                        return (
                          <div key={msg.id}>
                            <ImChatMsg msg={msg} />
                          </div>
                        )
                      })}
                    </div>
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

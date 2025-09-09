import { FolderOutlined, MessageOutlined, SmileOutlined } from '@ant-design/icons';
import { FaFlexRestLayout, FaUtils } from '@fa/ui';
import { UserLayoutContext } from '@features/fa-admin-pages/layout';
import { imConversationApi, imMessageApi } from '@features/fa-im-pages/services';
import { Im, ImEnums } from '@features/fa-im-pages/types';
import { Badge, Button, Empty, Input, Space, Splitter } from 'antd';
import clsx from 'clsx';
import { isNil } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import ImChatMsg from './ImChatMsg';
import useBus, { dispatch } from 'use-bus';
import ImChatCover from './ImChatCover';

/**
 * @author xu.pengfei
 * @date 2025-09-08 14:18:22
 */
export default function ImChatMsgPanel() {
  const {user} = useContext(UserLayoutContext)
  const [convList, setConvList] = useState<Im.ImConversationRetVo[]>([]);
  const [convSel, setConvSel] = useState<Im.ImConversationRetVo>();
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

  function handleClickConv(conv: Im.ImConversationRetVo) {
    // 设置选中的聊天
    setConvSel(conv)
    // 查询消息列表
    imMessageApi.pageQuery({ query: { conversationId: conv.id }, order: 'id DESC', pageSize: 40 }).then(res => {
      setMsgList(res.data.rows.map(i => ({ ...i, sending: false })))
    })
    // 更新消息未读数量
    if (conv.unreadCount > 0) {
      imConversationApi.updateConversationRead({ conversationId: conv.id }).then(() => {
        setConvList(prev => prev.map(i => i.id === conv.id ? { ...i, unreadCount: 0 } : i))
        dispatch({ type: '@@api/IM_REFRESH_UNREAD_COUNT', payload: { } })
      })
    }
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

    // 更新聊天列表最新消息
    setConvList(prev => {
      return prev.map(item => {
        if (item.id === `${convSel.id}`) {
          return {
            ...item,
            lastMsg: messageText,
          }
        }
        return item
      })
    })

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
      // 查找聊天列表是否包含该聊天ID
      const conv = convList.find(item => item.id === `${data.conversationId}`);
      if (conv) {
        // 更新聊天列表最新消息
        setConvList(prev => {
          const newArr = prev.map(item => {
            if (item.id === `${data.conversationId}`) {
              // 如果是当前打开的聊天窗口，则设置未读消息数量为0
              const unreadCount = item.id === convSel?.id ? 0 : item.unreadCount + 1
              return {
                ...item,
                lastMsg: data.crtName + ":" + data.content,
                unreadCount,
                updTime: FaUtils.getCurDateTime(),
              }
            }
            return item
          })
          // TODO 将data.conversationId移动到第一个位置

          return newArr;
        })
      } else {
        imConversationApi.listQuery({ conversationId: `${data.conversationId}` }).then(res => {
          setConvList(prev => ([
            ...res.data,
            ...prev,
          ]))
        })
      }
      // 追加到选中聊天消息列表
      if (`${data.conversationId}` === convSel?.id) {
        setMsgList(prev => ([
          ...prev,
          {
            ...data,
            sending: false,
            error: '',
          }
        ]))
        // 更新当前聊天的未读数量
        imConversationApi.updateConversationRead({ conversationId: `${data.conversationId}` }).then(() => {
          dispatch({ type: '@@api/IM_REFRESH_UNREAD_COUNT', payload: { } })
        })
      }
    },
    [convSel, convList],
  )

  return (
    <Splitter style={{ height: '100%' }}>
      {/* left item */}
      <Splitter.Panel defaultSize={260} min={240} max="70%">
        <div className='fa-im-wx-panel-left-sub fa-flex-column'>
          {convList.map(conv => {
            return (
              <div key={conv.id} className={clsx('fa-flex-row-center fa-base-btn fa-p12', convSel?.id === conv.id && 'fa-im-wx-item-selected')} onClick={() => handleClickConv(conv)}>
                <Badge size="small" count={conv.unreadCount}>
                  <ImChatCover conv={conv} />
                </Badge>
                <div className='fa-ml12 fa-flex-1'>
                  <div className='fa-flex-row-center'>
                    <div className='fa-flex-1'>{conv.convTitle}</div>
                    {/* TODO 最后更新时间：如果是今天，则展示HH:mm；如果是最近7天，则展示星期几；如果超过7天但是同一年的，则展示MM-DD；如果超过7天且不是同一年，则展示YYYY-MM-DD  */}
                    <div>{conv.updTime}</div>
                  </div>
                  <div>{conv.lastMsg}</div>
                </div>
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

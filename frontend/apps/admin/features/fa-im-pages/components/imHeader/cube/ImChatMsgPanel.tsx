import { EllipsisOutlined, FolderOutlined, MessageOutlined, SmileOutlined } from '@ant-design/icons';
import { BaseDrawer, FaFlexRestLayout, FaUtils } from '@fa/ui';
import { UserLayoutContext } from '@features/fa-admin-pages/layout';
import { fileSaveApi } from '@features/fa-admin-pages/services';
import { imConversationApi, imMessageApi } from '@features/fa-im-pages/services';
import { Im, ImEnums } from '@features/fa-im-pages/types';
import { Badge, Button, Dropdown, Empty, Input, Space, Splitter } from 'antd';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { isNil } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import useBus, { dispatch } from 'use-bus';
import ImChatCover from './ImChatCover';
import ImChatDetail from './ImChatDetail';
import ImChatMsg from './ImChatMsg';
import { formatConversationTime } from '../utils';

const { ImMessageTypeEnum } = ImEnums;

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
      if (isNil(convSel)) {
        handleClickConv(res.data[0])
      }
    })
  }

  useEffect(() => {
    getConvList();
  }, []);

  /** 点击聊天item */
  function handleClickConv(conv: Im.ImConversationRetVo) {
    if (isNil(conv)) return;
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

  /** 发送消息 */
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

    // 更新聊天列表最新消息，同时将本聊天置顶
    setConvList(prev => {
      const newArr = prev.map(item => {
        if (item.id === `${convSel.id}`) {
          return {
            ...item,
            lastMsg: messageText,
            updTime: FaUtils.getCurDateTime(),
          }
        }
        return item
      })
      // 将data.conversationId移动到第一个位置
      const targetIndex = newArr.findIndex(item => item.id === `${convSel.id}`);
      if (targetIndex !== -1) {
        const [targetItem] = newArr.splice(targetIndex, 1);
        newArr.unshift(targetItem);
      }
      return newArr;
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

  /** 接收消息: @@ws/RECEIVE/IM */
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
              let content = data.content;
              if (data.type === ImMessageTypeEnum.IMAGE) {
                content = '图片'
              } else if (data.type === ImMessageTypeEnum.VIDEO) {
                content = '视频'
              } else if (data.type === ImMessageTypeEnum.FILE) {
                content = '文件'
              }
              return {
                ...item,
                lastMsg: data.crtName + ":" + content,
                unreadCount,
                updTime: FaUtils.getCurDateTime(),
              }
            }
            return item
          })

          // 将data.conversationId移动到第一个位置
          const targetIndex = newArr.findIndex(item => item.id === `${data.conversationId}`);
          if (targetIndex !== -1) {
            const [targetItem] = newArr.splice(targetIndex, 1);
            newArr.unshift(targetItem);
          }

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

  /** 接收消息: @@event/CREATE_NEW_SINGLE */
  useBus(
    ['@@event/CREATE_NEW_SINGLE'],
    ({ type, payload }) => {
      console.log('callback', type, payload)
      const data = payload as Im.ImConversationRetVo
      const findConv = convList.find(i => i.id === data.id)
      if (findConv) {
        handleClickConv(findConv)
      } else {
        setConvList(prev => ([
          { ...data },
          ...prev
        ]))
      }
    },
    [convList],
  )

  /** 接收消息: @@ws/RECEIVE/IM_EXIT_GROUP_CHAT */
  useBus(
    ['@@ws/RECEIVE/IM_EXIT_GROUP_CHAT'],
    ({ type, payload }) => {
      console.log('callback', type, payload)
      const data = payload as Im.ImConversationRetVo
      setConvList(prev => prev.filter(i => i.id !== data.id))
    },
    [convList],
  )

  /** 接收消息: @@ws/RECEIVE/IM_REFRESH_GROUP_CHAT */
  useBus(
    ['@@ws/RECEIVE/IM_REFRESH_GROUP_CHAT'],
    ({ type, payload }) => {
      console.log('callback', type, payload)
      const data = payload as Im.ImConversationRetVo
      setConvList(prev => prev.map(item => item.id === data.id ? { ...item, ...data} : item))
    },
    [convList],
  )

  /** upload file */
  function handleClickUploadFile() {
    // 创建一个隐藏的文件输入框
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true; // 允许多选文件

    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || !convSel) return;

      // 遍历所有选中的文件
      Array.from(files).forEach(file => {
        let type = ImEnums.ImMessageTypeEnum.FILE
        if (FaUtils.isImageByFileName(file.name)) {
          type = ImEnums.ImMessageTypeEnum.IMAGE
        } else if (FaUtils.isVideoByFileName(file.name)) {
          type = ImEnums.ImMessageTypeEnum.VIDEO
        }
        // 先将文件上传到服务器
        fileSaveApi.uploadFile(file, (progress: any) => {
          const percent = (progress.loaded / progress.total * 100).toFixed(2);
          console.log('上传进度:', percent + '%');
        }).then((res: any) => {
          if (res.status === 200 && res.data) {
            const fileInfo = res.data;

            // 上传成功后，发送消息
            imConversationApi.sendMsg({
              conversationId: convSel.id,
              type,
              content: JSON.stringify({
                fileId: fileInfo.id,
                fileName: fileInfo.originalFilename,
                fileSize: fileInfo.size,
                ext: fileInfo.ext,
              }),
            }).then(res => {
              // 发送成功后清空输入框
              if (res.status === 200) {
                const msg = res.data;
                setMsgList(prev => [
                  ...prev,
                  {
                    ...msg,
                    sending: false,
                  }
                ]);
              }
            });
          }
        });
      });
    }

    // 触发文件选择框
    input.click();
  }

  /** 聊天记录item右键菜单点击 */
  function handleClickConvMenu(key: string, conv: Im.ImConversationRetVo) {
    // console.log('key', key, 'conv', conv)
    if (key === 'hide') {
      setConvList(prev => prev.filter(i => i.id !== conv.id))
      if (conv.id === convSel?.id) {
        setConvSel(undefined)
      }
    } else if (key === 'delete') {
    }
  }

  return (
    <Splitter>
      {/* left item */}
      <Splitter.Panel defaultSize={260} min={240} max="70%">
        <div className='fa-im-wx-panel-left-sub fa-flex-column'>
          {convList.map(conv => {
            return (
              <Dropdown
                key={conv.id}
                menu={{
                  items: [
                    {key: 'hide', label: '不显示'},
                    // {key: 'delete', label: '删除', danger: true},
                  ],
                  onClick: (menuInfo) => handleClickConvMenu(menuInfo.key, conv),
                }}
                trigger={['contextMenu']}
              >
                <div key={conv.id} className={clsx('fa-flex-row-center fa-base-btn fa-p12', convSel?.id === conv.id && 'fa-im-wx-item-selected')} onClick={() => handleClickConv(conv)}>
                  <Badge size="small" count={conv.unreadCount}>
                    <ImChatCover conv={conv} />
                  </Badge>
                  <div className='fa-ml12 fa-flex-1'>
                    <div className='fa-flex-row-center'>
                      <div className='fa-flex-1 fa-word-ellipse fa-im-wx-conv-item-title'>{conv.type === ImEnums.ImConversationTypeEnum.GROUP ? conv.title : conv.convTitle}</div>
                      {/* 最后更新时间：如果是今天，则展示HH:mm；如果是最近7天，则展示星期几；如果超过7天但是同一年的，则展示MM-DD；如果超过7天且不是同一年，则展示YYYY-MM-DD  */}
                      <div className='fa-im-wx-conv-item-right-time'>{formatConversationTime(conv.updTime)}</div>
                    </div>
                    <div className='fa-word-ellipse fa-im-wx-conv-item-last-msg'>{conv.lastMsg}</div>
                  </div>
                </div>
              </Dropdown>
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
                <div>{convSel.convTitle}</div>
                <div className='fa-flex-1'></div>
                <BaseDrawer
                  triggerDom={<Button type='text' icon={<EllipsisOutlined style={{fontSize: '24px'}} />}></Button>}
                  push={false}
                  width={300}
                  title="聊天详情"
                >
                  <ImChatDetail
                    conv={convSel}
                    onCreateNewConv={nc => {
                      const newConv = { ...nc, unreadCount: 0, convTitle: '群聊' }
                      setConvList(prev => ([
                        newConv,
                        ...prev,
                      ]))
                      handleClickConv(newConv) // 选中刚创建的新聊天
                    }}
                    onUpdateConv={nc => {
                      setConvList(prev => prev.map(i => i.id === nc.id ? { ...i, ...nc } : i))
                    }}
                  />
                </BaseDrawer>
              </div>

              {/* msg list panel */}
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
                  <Splitter.Panel defaultSize={150} max={260} min={100}>
                    <div className='fa-full fa-flex-column fa-p12'>
                      <Space>
                        <Button type="text" icon={<SmileOutlined />} />
                        <Button type="text" icon={<FolderOutlined />} onClick={handleClickUploadFile} />
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

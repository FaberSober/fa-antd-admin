import { EllipsisOutlined, FolderOutlined, MessageOutlined, SmileOutlined } from '@ant-design/icons';
import { BaseDrawer, FaFlexRestLayout, FaUtils } from '@fa/ui';
import { UserLayoutContext } from '@features/fa-admin-pages/layout';
import { fileSaveApi } from '@features/fa-admin-pages/services';
import { imConversationApi, imMessageApi } from '@features/fa-im-pages/services';
import { Im, ImEnums } from '@features/fa-im-pages/types';
import { Badge, Button, Dropdown, Empty, Input, Space, Splitter } from 'antd';
import clsx from 'clsx';
import { isNil, min } from 'lodash';
import { ClipboardEvent, useContext, useEffect, useState } from 'react';
import useBus, { dispatch } from 'use-bus';
import { formatConversationTime } from '../utils';
import { formatChatTime } from './utils';
import ImChatCover from './ImChatCover';
import ImChatDetail from './ImChatDetail';
import ImChatMsg from './ImChatMsg';

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
  const [pendingFiles, setPendingFiles] = useState<Array<{ file: File; type: ImEnums.ImMessageTypeEnum }>>([]);
  const [maxMsgId, setMaxMsgId] = useState<number>() // 本次加载最大的聊天记录ID
  const [hasNextPage, setHasNextPage] = useState(false) // 是否还有更早的聊天记录

  // 监听消息列表变化，滚动到底部
  // 初始化滚动监听
  useEffect(() => {
    const container = document.getElementById('fa-im-chat-msg-container');
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop === 0 && hasNextPage) {
        loadPreMsg();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [hasNextPage, convSel, msgList]);

  // // 新消息时滚动到底部
  // useEffect(() => {
  //   // 使用setTimeout确保DOM已经更新
  //   FaUtils.scrollToBottomById('fa-im-chat-msg-container', 100)
  // }, [msgList]);

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
    imMessageApi.pageQuery({ query: { conversationId: conv.id }, pageSize: 40 }).then(res => {
      res.data.rows.reverse()
      setMsgList(res.data.rows.map(i => ({ ...i, sending: false })))
      setHasNextPage(res.data.pagination.hasNextPage)
      setMaxMsgId(min(res.data.rows.map(i => Number(i.id))))
      FaUtils.scrollToBottomById('fa-im-chat-msg-container', 100)
    })
    // 更新消息未读数量
    if (conv.unreadCount > 0) {
      imConversationApi.updateConversationRead({ conversationId: conv.id }).then(() => {
        setConvList(prev => prev.map(i => i.id === conv.id ? { ...i, unreadCount: 0 } : i))
        dispatch({ type: '@@api/IM_REFRESH_UNREAD_COUNT', payload: { } })
      })
    }
  }

  /** 加载之前的聊天记录 */
  function loadPreMsg() {
    if (isNil(convSel)) return;
    if (!hasNextPage) return;

    // 获取当前第一条消息的DOM元素和其位置信息
    const container = document.getElementById('fa-im-chat-msg-container');
    const firstMsg = msgList[0];
    const firstMsgElement = document.getElementById(`fa-msg-item-${firstMsg.id}`);

    if (!container || !firstMsgElement) return;

    // 记录第一条消息到容器顶部的距离
    const oldDistanceFromTop = firstMsgElement.offsetTop;

    imMessageApi.pageQuery({ query: { conversationId: convSel.id, maxMsgId }, pageSize: 40 }).then(res => {
      res.data.rows.reverse();
      setMsgList(prev => [ ...res.data.rows.map(i => ({ ...i, sending: false })), ...prev ]);
      setHasNextPage(res.data.pagination.hasNextPage);
      setMaxMsgId(min(res.data.rows.map(i => Number(i.id))));

      // 在下一个渲染周期后调整滚动位置
      setTimeout(() => {
        const newFirstMsgElement = document.getElementById(`fa-msg-item-${firstMsg.id}`);
        if (newFirstMsgElement && container) {
          // 计算新的滚动位置：新消息的高度 = 新位置 - 原来的位置
          const newDistanceFromTop = newFirstMsgElement.offsetTop;
          const scrollOffset = newDistanceFromTop - oldDistanceFromTop;
          container.scrollTop = scrollOffset;
        }
      }, 10);
    });
  }

  /** 发送文本消息 */
  function handleSendTextMsg() {
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
    FaUtils.scrollToBottomById('fa-im-chat-msg-container', 100)

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

  /** 发送文件消息 */
  async function handleSendFileMsg() {
    if (pendingFiles.length === 0 || !convSel) return;

    // 清空输入框和待发送文件列表
    setMessageText('');

    // 为每个文件创建临时消息并添加到消息列表
    const tempMsgs = pendingFiles.map(pending => ({
      id: FaUtils.uuid(),
      conversationId: convSel.id,
      senderId: user.id,
      senderUserImg: user.img,
      type: pending.type,
      content: JSON.stringify({
        fileName: pending.file.name,
        fileSize: pending.file.size,
        ext: pending.file.name.split('.').pop() || '',
      }),
      isWithdrawn: false,
      uploading: true,
      progress: 0,
      uploadSuccess: false,
      sending: false,
    } as Im.ImMessageShow));

    setMsgList(prev => [...prev, ...tempMsgs]);

    // 并行上传所有文件
    const filesToUpload = [...pendingFiles];
    setPendingFiles([]); // 清空待发送列表

    await Promise.all(tempMsgs.map(async (tempMsg, index) => {
      const pending = filesToUpload[index];
      try {
        const res = await fileSaveApi.uploadFile(pending.file, (progress: any) => {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          // 更新对应消息的上传进度
          setMsgList(prev => prev.map(msg =>
            msg.id === tempMsg.id
              ? { ...msg, progress: percent }
              : msg
          ));
        });

        if (res.status === 200 && res.data) {
          const fileInfo = res.data;
          const msgRes = await imConversationApi.sendMsg({
            conversationId: convSel.id,
            type: pending.type,
            content: JSON.stringify({
              fileId: fileInfo.id,
              fileName: fileInfo.originalFilename,
              fileSize: fileInfo.size,
              ext: fileInfo.ext,
            }),
          });

          if (msgRes.status === 200) {
            // 用服务器返回的消息更新临时消息
            setMsgList(prev => prev.map(msg =>
              msg.id === tempMsg.id
                ? {
                    ...msgRes.data,
                    uploading: false,
                    uploadSuccess: true,
                    sending: false,
                  }
                : msg
            ));
          }
        }
      } catch (error) {
        console.error('文件上传或发送失败:', error);
        // 更新消息状态为失败
        setMsgList(prev => prev.map(msg =>
          msg.id === tempMsg.id
            ? {
                ...msg,
                uploading: false,
                error: '文件上传失败',
              }
            : msg
        ));
      }
    }));
  }

  /** 发送消息 */
  function handleSendMsg() {
    if (pendingFiles.length > 0) {
      handleSendFileMsg();
    } else {
      handleSendTextMsg();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLTextAreaElement>) {
    const items = e.clipboardData.items;
    const fileItems = [];

    let hasFile = false;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      // 如果是文件类型
      if (item.kind === 'file') {
        hasFile = true;
        const file = item.getAsFile();
        if (!file || !convSel) continue;

        let type = ImEnums.ImMessageTypeEnum.FILE;
        if (FaUtils.isImageByFileName(file.name)) {
          type = ImEnums.ImMessageTypeEnum.IMAGE;
        } else if (FaUtils.isVideoByFileName(file.name)) {
          type = ImEnums.ImMessageTypeEnum.VIDEO;
        }

        fileItems.push({ file, type });
      }
    }

    if (hasFile) {
      e.preventDefault(); // 阻止默认粘贴行为
      // 设置待发送文件
      setPendingFiles(fileItems);
      // 设置预览信息到输入框
      const fileNames = fileItems.map(item => item.file.name).join('、');
      setMessageText(`[文件] ${fileNames} (回车发送，ESC取消)`);
    }
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
      setConvList(prev => prev.filter(item => `${item.id}` !== `${data.id}`))
      if (convSel?.id === `${data.id}`) {
        setConvSel(undefined)
      }
    },
    [convList],
  )

  /** 接收消息: @@ws/RECEIVE/IM_REFRESH_GROUP_CHAT */
  useBus(
    ['@@ws/RECEIVE/IM_REFRESH_GROUP_CHAT'],
    ({ type, payload }) => {
      console.log('callback', type, payload)
      const data = payload as Im.ImConversationRetVo
      setConvList(prev => prev.map(item => `${item.id}` === `${data.id}` ? { ...item, ...data} : item))
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
                      <div id="fa-im-chat-msg-container" className='fa-full-content fa-scroll-auto-y'>
                        {msgList.map((msg, index) => {
                          const timeStr = msg.crtTime ? formatChatTime(
                            msg.crtTime,
                            index > 0 && msgList[index - 1].crtTime ? msgList[index - 1].crtTime : undefined
                          ) : null;
                          return (
                            <div key={msg.id} id={`fa-msg-item-${msg.id}`}>
                              {timeStr && (
                                <div className="fa-text-center fa-im-wx-msg-time">
                                  <span>{timeStr}</span>
                                </div>
                              )}
                              <ImChatMsg msg={msg} />
                            </div>
                          );
                        })}
                      </div>
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
                          } else if (e.key === 'Escape' && pendingFiles.length > 0) {
                            setPendingFiles([]);
                            setMessageText('');
                          }
                        }}
                        onPaste={(e) => handlePaste(e)}
                        placeholder="输入消息，回车发送，Shift+回车换行。支持粘贴图片、文件"
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

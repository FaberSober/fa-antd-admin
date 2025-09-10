import { FileOutlined } from '@ant-design/icons';
import { PageLoading } from '@fa/ui';
import { fileSaveApi } from '@features/fa-admin-pages/services';
import { Im, ImEnums } from '@features/fa-im-pages/types';
import { Image, Space } from 'antd';
import React from 'react';

const { ImMessageTypeEnum } = ImEnums;

export interface ImChatMsgContentProps {
  msg: Im.ImMessageShow;
}

/**
 * 消息内容展示
 * @author xu.pengfei
 * @date 2025-09-10 15:44
 */
export default function ImChatMsgContent({ msg }: ImChatMsgContentProps) {
  // 如果是文件类型（2-图片/3-视频/4-文件）
  if ([ImMessageTypeEnum.IMAGE, ImMessageTypeEnum.VIDEO, ImMessageTypeEnum.FILE].indexOf(msg.type) !== -1) {
    try {
      const fileInfo = JSON.parse(msg.content);
      const { fileId, fileName, ext } = fileInfo;
      const previewUrl = fileSaveApi.genLocalGetFilePreview(fileId);
      const fileUrl = fileSaveApi.genLocalGetFile(fileId);

      // 图片文件
      if (['png', 'jpg', 'jpeg', 'gif'].includes(ext.toLowerCase())) {
        return (
          <div className='fa-im-wx-msg-image'>
            <Image
              src={previewUrl}
              style={{ maxWidth: '100%', maxHeight: 300 }}
              placeholder={<PageLoading />}
              preview={{ src: fileUrl }}
            />
          </div>
        );
      }

      // 视频文件
      if (['mp4', 'webm', 'ogg'].includes(ext.toLowerCase())) {
        const previewUrl = fileSaveApi.genLocalGetFilePreview(fileId);
        return (
          <div className='fa-im-wx-msg-video' style={{ position: 'relative', cursor: 'pointer' }} onClick={() => window.open(fileUrl, '_blank')}>
            <video
              width="200"
              height="150"
              controls
              style={{ backgroundColor: '#000' }}
            >
              <source src={fileUrl} type={`video/${ext.toLowerCase()}`} />
              您的浏览器不支持 video 标签。
            </video>
          </div>
        );
      }

      // 其他类型文件
      return (
        <div className='fa-im-wx-msg-file' style={{ cursor: 'pointer' }} onClick={() => window.open(fileUrl, '_blank')}>
          <Space>
            <FileOutlined style={{ fontSize: 24 }} />
            <div>
              <div>{fileName}</div>
              <div className="fa-text-grey">{ext.toUpperCase()}文件</div>
            </div>
          </Space>
        </div>
      );
    } catch (e) {
      console.error('解析文件消息内容失败:', e);
      return <div className="fa-text-error fa-im-wx-msg-text">文件消息解析失败</div>;
    }
  }

  // 其他类型消息（文本）
  return <div className="fa-break-word fa-im-wx-msg-text">{msg.content}</div>;
}

import React from 'react';
import { Media } from '@/types';
import { Descriptions } from "antd";


export interface MediaVideoViewProps {
  item: Media.MediaVideo;
}

/**
 * 媒体-视频信息表实体详情查看
 */
export default function MediaVideoView({item}: MediaVideoViewProps) {
  return (
    <Descriptions column={1} bordered>
      <Descriptions.Item label="视频记录唯一ID">{item.id}</Descriptions.Item>
      <Descriptions.Item label="关联业务ID（如文章ID、动态ID、课程ID等）">{item.businessId}</Descriptions.Item>
      <Descriptions.Item label="业务类型（如 post、moment、course 等）">{item.businessType}</Descriptions.Item>
      <Descriptions.Item label="原视频文件ID">{item.originFileId}</Descriptions.Item>
      <Descriptions.Item label="原始视频文件名（冗余存储，便于查询展示）">{item.originFilename}</Descriptions.Item>
      <Descriptions.Item label="原始视频宽度（像素）">{item.originWidth}</Descriptions.Item>
      <Descriptions.Item label="原始视频高度（像素）">{item.originHeight}</Descriptions.Item>
      <Descriptions.Item label="原始视频码率（kbps）">{item.originBitrate}</Descriptions.Item>
      <Descriptions.Item label="原始视频时长（秒）">{item.originDuration}</Descriptions.Item>
      <Descriptions.Item label="原始视频大小（MB）">{item.originSizeMb}</Descriptions.Item>
      <Descriptions.Item label="720p转码视频文件ID">{item.trans720pFileId}</Descriptions.Item>
      <Descriptions.Item label="720p视频大小（MB）">{item.trans720pSizeMb}</Descriptions.Item>
      <Descriptions.Item label="720p转码进度百分比（0-100，0表示未开始，100表示完成）">{item.trans720pProgress}</Descriptions.Item>
      <Descriptions.Item label="720p转码详细状态：0=未开始,1=转码中,2=成功,3=失败,4=已取消">{item.trans720pStatus}</Descriptions.Item>
      <Descriptions.Item label="720p转码失败或警告的详细信息（如错误日志）">{item.trans720pMessage}</Descriptions.Item>
      <Descriptions.Item label="720p转码开始时间">{item.trans720pStartTime}</Descriptions.Item>
      <Descriptions.Item label="720p转码结束时间">{item.trans720pEndTime}</Descriptions.Item>
      <Descriptions.Item label="封面图文件ID">{item.coverFileId}</Descriptions.Item>
      <Descriptions.Item label="预览视频文件ID">{item.previewFileId}</Descriptions.Item>
      <Descriptions.Item label="预览视频时长（秒）">{item.previewDuration}</Descriptions.Item>
      <Descriptions.Item label="视频容器格式（如 mp4、mov、webm）">{item.format}</Descriptions.Item>
      <Descriptions.Item label="视频编码（如 h264、h265、vp9）">{item.codecVideo}</Descriptions.Item>
      <Descriptions.Item label="音频编码（如 aac、mp3）">{item.codecAudio}</Descriptions.Item>
      <Descriptions.Item label="帧率">{item.fps}</Descriptions.Item>
      <Descriptions.Item label="视频状态：0=转码中,1=正常,-1=转码失败,-2=违规">{item.status}</Descriptions.Item>
      <Descriptions.Item label="审核状态：0=待审核,1=通过,2=拒绝">{item.auditStatus}</Descriptions.Item>
      <Descriptions.Item label="创建时间">{item.crtTime}</Descriptions.Item>
      <Descriptions.Item label="创建用户ID">{item.crtUser}</Descriptions.Item>
      <Descriptions.Item label="创建用户">{item.crtName}</Descriptions.Item>
      <Descriptions.Item label="创建IP">{item.crtHost}</Descriptions.Item>
      <Descriptions.Item label="更新时间">{item.updTime}</Descriptions.Item>
      <Descriptions.Item label="更新用户ID">{item.updUser}</Descriptions.Item>
      <Descriptions.Item label="更新用户">{item.updName}</Descriptions.Item>
      <Descriptions.Item label="更新IP">{item.updHost}</Descriptions.Item>
      <Descriptions.Item label="是否删除 0=正常 1=删除">{item.deleted}</Descriptions.Item>
    </Descriptions>
  )
}

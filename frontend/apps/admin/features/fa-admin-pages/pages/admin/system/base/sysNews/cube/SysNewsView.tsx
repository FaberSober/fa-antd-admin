import React from 'react';
import type { Admin } from '@/types';
import { Descriptions, Image } from 'antd';
import { fileSaveApi } from '@features/fa-admin-pages/services';
import FaRichHtmlView from '@features/fa-admin-pages/components/rich-html/FaRichHtmlView';

export interface SysNewsViewProps {
  item: Admin.SysNews;
}

/**
 * BASE-系统-新闻实体详情查看
 */
export default function SysNewsView({ item }: SysNewsViewProps) {
  return (
    <Descriptions column={1} bordered labelStyle={{ width: 80 }}>
      <Descriptions.Item label="ID">{item.id}</Descriptions.Item>
      <Descriptions.Item label="标题">{item.title}</Descriptions.Item>
      <Descriptions.Item label="封面">
        <Image
          width={100}
          // height={width}
          src={fileSaveApi.genLocalGetFilePreview(item.cover)}
          preview={{
            src: fileSaveApi.genLocalGetFile(item.cover),
          }}
        />
      </Descriptions.Item>
      <Descriptions.Item label="作者">{item.author}</Descriptions.Item>
      <Descriptions.Item label="内容">
        <FaRichHtmlView html={item.content} />
      </Descriptions.Item>
      <Descriptions.Item label="发布时间">{item.pubTime}</Descriptions.Item>
      <Descriptions.Item label="创建时间">{item.crtTime}</Descriptions.Item>
      <Descriptions.Item label="创建用户">{item.crtName}</Descriptions.Item>
      <Descriptions.Item label="创建IP">{item.crtHost}</Descriptions.Item>
      <Descriptions.Item label="更新时间">{item.updTime}</Descriptions.Item>
      <Descriptions.Item label="更新用户">{item.updName}</Descriptions.Item>
      <Descriptions.Item label="更新IP">{item.updHost}</Descriptions.Item>
    </Descriptions>
  );
}

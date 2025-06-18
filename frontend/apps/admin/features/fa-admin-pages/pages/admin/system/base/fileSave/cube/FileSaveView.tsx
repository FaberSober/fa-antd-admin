import React from 'react';
import type { Admin } from '@/types';
import { Descriptions, Divider } from 'antd';
import { FaUtils } from '@fa/ui';
import { fileSaveApi } from '@features/fa-admin-pages/services';

export interface FileSaveViewProps {
  item: Admin.FileSave;
}

/**
 * @author xu.pengfei
 * @date 2023/7/20 15:28
 */
export default function FileSaveView({ item }: FileSaveViewProps) {
  function handleCopy() {
    FaUtils.copyToClipboard(window.location.host + fileSaveApi.genLocalGetFile(item.id));
  }

  return (
    <Descriptions column={1} bordered>
      <Descriptions.Item label="URL">
        <a href={fileSaveApi.genLocalGetFile(item.id)} target="_blank" rel="noreferrer">
          打开链接
        </a>
        <Divider type="vertical" />
        <a onClick={handleCopy}>复制链接</a>
      </Descriptions.Item>
      <Descriptions.Item label="ID">{item.id}</Descriptions.Item>
      <Descriptions.Item label="文件存储地址">{item.url}</Descriptions.Item>
      <Descriptions.Item label="文件大小">{FaUtils.sizeToHuman(item.size)}</Descriptions.Item>
      <Descriptions.Item label="文件名">{item.filename}</Descriptions.Item>
      <Descriptions.Item label="原始文件名">{item.originalFilename}</Descriptions.Item>
      <Descriptions.Item label="基础存储路径">{item.basePath}</Descriptions.Item>
      <Descriptions.Item label="存储路径">{item.path}</Descriptions.Item>
      <Descriptions.Item label="文件扩展名">{item.ext}</Descriptions.Item>
      <Descriptions.Item label="MIME类型">{item.contentType}</Descriptions.Item>
      <Descriptions.Item label="存储平台">{item.platform}</Descriptions.Item>
      <Descriptions.Item label="缩略图访问路径">{item.thUrl}</Descriptions.Item>
      <Descriptions.Item label="缩略图名称">{item.thFilename}</Descriptions.Item>
      <Descriptions.Item label="缩略图大小，单位字节">{item.thSize}</Descriptions.Item>
      <Descriptions.Item label="缩略图MIME类型">{item.thContentType}</Descriptions.Item>
      <Descriptions.Item label="文件所属对象id">{item.objectId}</Descriptions.Item>
      <Descriptions.Item label="文件所属对象类型">{item.objectType}</Descriptions.Item>
      <Descriptions.Item label="附加属性">{item.attr}</Descriptions.Item>
      <Descriptions.Item label="文件MD5">{item.md5}</Descriptions.Item>
      <Descriptions.Item label="创建时间">{item.crtTime}</Descriptions.Item>
      <Descriptions.Item label="创建用户ID">{item.crtUser}</Descriptions.Item>
      <Descriptions.Item label="创建用户">{item.crtName}</Descriptions.Item>
      <Descriptions.Item label="创建IP">{item.crtHost}</Descriptions.Item>
    </Descriptions>
  );
}

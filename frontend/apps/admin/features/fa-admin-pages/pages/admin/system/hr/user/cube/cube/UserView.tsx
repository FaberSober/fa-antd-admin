import React from 'react';
import type { Admin } from '@/types';
import { Descriptions } from 'antd';

export interface UserViewProps {
  item: Admin.User;
}

/**
 * BASE-用户实体详情查看
 */
export default function UserView({ item }: UserViewProps) {
  return (
    <Descriptions column={2} bordered>
      <Descriptions.Item label="ID">{item.id}</Descriptions.Item>
      <Descriptions.Item label="部门ID">{item.departmentId}</Descriptions.Item>
      <Descriptions.Item label="账户">{item.username}</Descriptions.Item>
      <Descriptions.Item label="密码">{item.password}</Descriptions.Item>
      <Descriptions.Item label="姓名">{item.name}</Descriptions.Item>
      <Descriptions.Item label="手机号">{item.tel}</Descriptions.Item>
      <Descriptions.Item label="生日">{item.birthday}</Descriptions.Item>
      <Descriptions.Item label="性别">{item.sex}</Descriptions.Item>
      <Descriptions.Item label="地址">{item.address}</Descriptions.Item>
      <Descriptions.Item label="邮箱">{item.email}</Descriptions.Item>
      <Descriptions.Item label="状态">{item.status}</Descriptions.Item>
      <Descriptions.Item label="角色名称">{item.roleNames}</Descriptions.Item>
      <Descriptions.Item label="描述">{item.description}</Descriptions.Item>
      <Descriptions.Item label="头像URL">{item.img}</Descriptions.Item>
      <Descriptions.Item label="api token">{item.apiToken}</Descriptions.Item>
      <Descriptions.Item label="开放平台的唯一标识符">{item.wxUnionId}</Descriptions.Item>
      <Descriptions.Item label="微信小程序用户唯一标识">{item.wxMaOpenid}</Descriptions.Item>
      <Descriptions.Item label="创建时间">{item.crtTime}</Descriptions.Item>
      <Descriptions.Item label="创建用户ID">{item.crtUser}</Descriptions.Item>
      <Descriptions.Item label="创建用户">{item.crtName}</Descriptions.Item>
      <Descriptions.Item label="创建IP">{item.crtHost}</Descriptions.Item>
      <Descriptions.Item label="更新时间">{item.updTime}</Descriptions.Item>
      <Descriptions.Item label="更新用户ID">{item.updUser}</Descriptions.Item>
      <Descriptions.Item label="更新用户">{item.updName}</Descriptions.Item>
      <Descriptions.Item label="更新IP">{item.updHost}</Descriptions.Item>
      <Descriptions.Item label="是否删除">{item.deleted}</Descriptions.Item>
    </Descriptions>
  );
}

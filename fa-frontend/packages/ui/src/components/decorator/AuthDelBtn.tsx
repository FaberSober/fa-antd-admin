import React from 'react';
import { ShiroPermissionContainer } from '@/components/auth';
import { Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export interface AuthDelBtnProps {
  handleDelete: () => void;
  permission?: string;
}

/**
 * 删除确认按钮
 * @author xu.pengfei
 * @date 2022/12/5
 */
export default function AuthDelBtn({ handleDelete, permission }: AuthDelBtnProps) {
  return (
    <ShiroPermissionContainer permission={permission}>
      <Popconfirm title="确认删除?" onConfirm={() => handleDelete()} placement="topRight">
        <a style={{ color: 'red' }}>
          <DeleteOutlined /> 删除
        </a>
      </Popconfirm>
    </ShiroPermissionContainer>
  );
}

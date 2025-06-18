import React from 'react';
import { ShiroPermissionContainer } from '@ui/components/auth';
import { Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export interface AuthDelBtnProps {
  handleDelete: () => void;
  permission?: string;
  showIcon?: boolean;
  text?: string;
}

/**
 * 删除确认按钮
 * @author xu.pengfei
 * @date 2022/12/5
 */
export default function AuthDelBtn({ handleDelete, permission, showIcon = true, text = '删除' }: AuthDelBtnProps) {
  return (
    <ShiroPermissionContainer permission={permission}>
      <Popconfirm title="确认删除?" onConfirm={() => handleDelete()} placement="topRight">
        <a className="fa-link-btn" style={{ color: 'red' }}>
          {showIcon && <DeleteOutlined /> }
          {text}
        </a>
      </Popconfirm>
    </ShiroPermissionContainer>
  );
}

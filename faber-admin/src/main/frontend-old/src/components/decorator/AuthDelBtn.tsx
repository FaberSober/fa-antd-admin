import FaberBase from "@/props/base/FaberBase";
import {ShiroPermissionContainer} from "@/components/auth";
import {Popconfirm} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import React, {useContext} from "react";
import {UserContext} from "@/layout/UserSimpleLayout";

/**
 * 返回加权限校验的删除按钮
 * @param record
 * @param handleDelete
 * @param elements
 * @param permission
 */
export default function AuthDelBtn<T>({
  record,
  handleDelete,
  permission,
}: {
  record: T;
  handleDelete: (v: T) => void;
  permission?: string;
}) {
  const { user } = useContext(UserContext);

  return (
    <ShiroPermissionContainer roleList={user.elements} permission={permission}>
      <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record)} getPopupContainer={() => document.body}>
        <a style={{ color: 'red' }}>
          <DeleteOutlined /> 删除
        </a>
      </Popconfirm>
    </ShiroPermissionContainer>
  );
}

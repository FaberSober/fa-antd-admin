import React, {useEffect, useState} from 'react';
import {userApi} from "@ui/services/base";
import {Admin} from "@ui/types";
import {Button, Space, Table} from "antd";
import {isNil} from "lodash";
import {SelectedUser} from "./BizUserSelect";


export interface SelectedUserListProps {
  selectedUsers?: SelectedUser[]; // 已经选中的用户ID
  onRemove?: (item: Admin.User) => void;
}

/**
 * @author xu.pengfei
 * @date 2022/12/28 16:21
 */
export default function SelectedUserList({selectedUsers, onRemove}: SelectedUserListProps) {
  const [array, setArray] = useState<Admin.User[]>([]);

  useEffect(() => {
    // console.log('selectedUsers', selectedUsers)
    if (isNil(selectedUsers) || selectedUsers.length === 0) {
      setArray([])
      return;
    }
    userApi.list({query: {'id#$in': selectedUsers.map(i => i.id)}}).then(res => {
      setArray(res.data)
    })
  }, [selectedUsers])

  const disallowRemoveUserIds = (selectedUsers || []).filter(i => !i.allowRemove).map(i => i.id)
  return (
    <Table
      rowKey="id"
      columns={[
        {dataIndex: 'name', title: '名称'},
        {
          title: '操作',
          dataIndex: 'opr',
          render: (_, record) => (
            <Space>
              {disallowRemoveUserIds.indexOf(record.id) === -1 && (
                <Button onClick={() => onRemove && onRemove(record)} type="dashed" size="small" danger>删除</Button>
              )}
            </Space>
          ),
          width: 80,
          fixed: 'right',
        },
      ]}
      dataSource={array}
      pagination={false}
      size="small"
    />
  )
}

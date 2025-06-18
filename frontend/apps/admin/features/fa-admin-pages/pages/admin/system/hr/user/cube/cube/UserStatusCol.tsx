import React, { useState } from 'react';
import type { Admin } from '@features/fa-admin-pages/types';
import { userApi as api } from '@features/fa-admin-pages/services';
import { Switch } from 'antd';

export interface UserStatusColProps {
  item: Admin.User;
  onChange: (i: Admin.User) => void;
}

/**
 * @author xu.pengfei
 * @date 2024/1/17 16:03
 */
export default function UserStatusCol({ item, onChange }: UserStatusColProps) {
  const [loading, setLoading] = useState(false);

  function handleEnableUpdate(status: boolean) {
    setLoading(true);
    api
      .updateSimpleById(item.id, { id: item.id, status })
      .then((_res) => {
        setLoading(false);
        onChange(item);
      })
      .catch(() => setLoading(false));
  }

  return <Switch checkedChildren="有效" unCheckedChildren="禁止" checked={item.status} onChange={(e) => handleEnableUpdate(e)} loading={loading} />;
}

import { rbacMenuApi } from '@features/fa-admin-pages/services';
import type { Rbac } from '@/types';
import { Switch } from 'antd';
import { useEffect, useState } from 'react';

interface MenuStatusSwitchProps {
  item: Rbac.RbacMenu;
}

export default function MenuStatusSwitch({ item }: MenuStatusSwitchProps) {
  const [checked, setChecked] = useState(item.status);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setChecked(item.status);
  }, [item.status]);

  function handleChange(status: boolean) {
    const prevStatus = checked;
    setChecked(status);
    setLoading(true);

    rbacMenuApi
      .update(item.id, { ...item, status })
      .then(() => {
        item.status = status;
      })
      .catch(() => {
        setChecked(prevStatus);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={checked} loading={loading} onChange={handleChange} />;
}

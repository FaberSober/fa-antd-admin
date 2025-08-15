import React, { useState } from 'react';
import { Checkbox, Spin } from 'antd';
import type { Admin } from '@features/fa-admin-pages/types';
import { dictDataApi as api } from '@features/fa-admin-pages/services';

export interface DictDataValidSwitchProps {
  item: Admin.DictData;
  onChange: (i: Admin.DictData) => void;
}

/**
 * @author xu.pengfei
 * @date 2024/1/17 16:03
 */
export default function DictDataValidSwitch({ item, onChange }: DictDataValidSwitchProps) {
  const [loading, setLoading] = useState(false);

  function handleUpdate() {
    setLoading(true);
    const valid = !item.valid
    api.update(item.id, { ...item, valid }).then((_res) => {
      setLoading(false);
      onChange({ ...item, valid });
    }).catch(() => setLoading(false));
  }

  return (
    <Spin spinning={loading || false} size="small">
      <Checkbox checked={item.valid} onChange={() => handleUpdate()} />
    </Spin>
  );
}

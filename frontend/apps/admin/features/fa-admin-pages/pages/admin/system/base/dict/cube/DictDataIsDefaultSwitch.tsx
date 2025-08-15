import React, { useState } from 'react';
import { Checkbox, Spin } from 'antd';
import type { Admin } from '@features/fa-admin-pages/types';
import { dictDataApi as api } from '@features/fa-admin-pages/services';

export interface DictDataIsDefaultSwitchProps {
  item: Admin.DictData;
  onChange: (i: Admin.DictData) => void;
}

/**
 * @author xu.pengfei
 * @date 2024/1/17 16:03
 */
export default function DictDataIsDefaultSwitch({ item, onChange }: DictDataIsDefaultSwitchProps) {
  const [loading, setLoading] = useState(false);

  function handleEnableUpdate() {
    setLoading(true);
    api.toggleDefaultById(item.id).then((_res) => {
      setLoading(false);
      onChange({ ...item, isDefault: !item.isDefault });
    }).catch(() => setLoading(false));
  }

  return (
    <Spin spinning={loading || false} size="small">
      <Checkbox checked={item.isDefault} onChange={() => handleEnableUpdate()} />
    </Spin>
  );
}

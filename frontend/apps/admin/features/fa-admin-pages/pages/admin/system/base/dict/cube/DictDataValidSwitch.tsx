import { useEffect, useState } from 'react';
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
  const [checked, setChecked] = useState(item.valid);

  useEffect(() => {
    setChecked(item.valid);
  }, [item.valid]);

  function handleUpdate() {
    const valid = !checked;
    setChecked(valid);
    setLoading(true);
    api.update(item.id, { ...item, valid }).then((_res) => {
      setLoading(false);
      onChange({ ...item, valid });
    }).catch(() => {
      setChecked(!valid);
      setLoading(false);
    });
  }

  return (
    <Spin spinning={loading || false} size="small">
      <Checkbox checked={checked} disabled={loading} onChange={() => handleUpdate()} />
    </Spin>
  );
}

import React from 'react';
import { Segmented } from 'antd';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';

export interface ViewTypeToggleProps {
  value?: string;
  onChange?: (v: any) => void;
}

/**
 * @author xu.pengfei
 * @date 2022/12/31 17:52
 */
export default function ViewTypeToggle({ value, onChange }: ViewTypeToggleProps) {
  return (
    <Segmented
      value={value}
      onChange={onChange}
      options={[
        {
          value: 'list',
          icon: <BarsOutlined />,
        },
        {
          value: 'kanban',
          icon: <AppstoreOutlined />,
        },
      ]}
    />
  );
}

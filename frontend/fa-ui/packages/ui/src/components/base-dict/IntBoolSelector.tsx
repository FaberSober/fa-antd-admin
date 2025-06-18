import React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/es/select';

/**
 * @author xu.pengfei
 * @date 2021/3/11
 */
export default function IntBoolSelector(props: SelectProps<any>) {
  const options: any[] = [
    { label: '是', value: 1 },
    { label: '否', value: 0 },
  ];

  return <Select allowClear options={options} style={{ minWidth: 70 }} {...props} />;
}

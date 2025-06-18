import React from 'react';
import { Select, type SelectProps } from 'antd';

/**
 * @author xu.pengfei
 * @date 2024/2/4 14:34
 */
export default function MonthSelect(props: SelectProps) {
  return (
    <Select
      placeholder="月份"
      options={[
        { label: '1月', value: 1 },
        { label: '2月', value: 2 },
        { label: '3月', value: 3 },
        { label: '4月', value: 4 },
        { label: '5月', value: 5 },
        { label: '6月', value: 6 },
        { label: '7月', value: 7 },
        { label: '8月', value: 8 },
        { label: '9月', value: 9 },
        { label: '10月', value: 10 },
        { label: '11月', value: 11 },
        { label: '12月', value: 12 },
      ]}
      {...props}
    />
  );
}

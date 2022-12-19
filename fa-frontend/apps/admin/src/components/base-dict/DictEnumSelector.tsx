import React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/es/select';
import { Fa } from '@/types';

interface IProps extends SelectProps<any> {
  dicts: Fa.Dict[]; // 字典分组编码
}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictEnumSelector({ dicts, value, ...props }: IProps) {
  const options = dicts.map((v) => ({
    value: v.value,
    label: v.label,
  }));

  return (
    <Select style={{ minWidth: 170 }} allowClear placeholder="请选择" value={value} options={options} {...props} />
  );
}

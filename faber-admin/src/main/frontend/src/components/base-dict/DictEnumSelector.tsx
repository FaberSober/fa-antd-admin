import React from 'react';
import {Select} from 'antd';
import {SelectProps} from 'antd/es/select';
import {Fa} from "@/props/base";
import {optionsToLabel} from "@/utils/utils";

interface IProps extends SelectProps<any> {
  dicts: Fa.Dict[]; // 字典分组编码
  onChange?: (value: any, label: any, option: any) => void;
}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictEnumSelector({ dicts, onChange, value, ...props }: IProps) {
  function handleChange(v: any, option: any) {
    if (onChange) onChange(v, optionsToLabel(option), option);
  }

  const options = dicts.map((v) => ({
    value: v.value,
    label: v.text,
  }));

  return (
    <Select
      style={{ minWidth: 170 }}
      onChange={handleChange}
      allowClear
      placeholder="请选择"
      value={value}
      options={options}
      {...props}
    />
  );
}

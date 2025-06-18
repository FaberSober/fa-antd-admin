import React from 'react';
import { Checkbox } from 'antd';
import { useEnum } from "@ui/components/base-dict/hooks";
import { CheckboxGroupProps } from "antd/es/checkbox";


interface IProps extends CheckboxGroupProps  {
  enumName: string; // 枚举名称
  transValue?: (v: any) => any; // value类型转换
}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictEnumApiCheckbox({ enumName, transValue, ...props }: IProps) {
  const {options} = useEnum(enumName, transValue)

  return (
    <Checkbox.Group options={options} {...props} />
  );
}


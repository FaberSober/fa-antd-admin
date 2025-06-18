import React from 'react';
import {find, trim} from 'lodash';
import {useEnum} from "@ui/components/base-dict/hooks";

interface IProps  {
  value: any;
  enumName: string; // 枚举名称
}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictEnumApiShow({ enumName, value }: IProps) {
  const {options} = useEnum(enumName)

  const item = find(options, (i) => trim(i.value) === trim(value))
  return (
    <span>{item && item.label}</span>
  );
}

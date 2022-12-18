import React from 'react';
import {Radio} from 'antd';
import {RadioProps} from "antd/es/radio";
import {useEnum} from "@/components/base-dict/hooks";


interface IProps extends RadioProps  {
  enumName: string; // 枚举名称
  transValue?: (v: any) => any; // value类型转换
}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictEnumApiRadio({ enumName, transValue, ...props }: IProps) {
  const {options} = useEnum(enumName, transValue)

  return (
    <Radio.Group options={options} optionType="button" buttonStyle="solid" {...props} />
  );
}


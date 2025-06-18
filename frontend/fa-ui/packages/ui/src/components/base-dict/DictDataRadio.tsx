import React from 'react';
import {Radio} from 'antd';
import {RadioProps} from 'antd/es/radio';
import {useDict} from "@ui/components/base-dict/hooks";


export interface IProps extends RadioProps {
  dictLabel: string; // 字典分组编码
  transValue?: (v: any) => any; // value类型转换
}

/**
 * @author xu.pengfei
 * @date 2020/12/27
 */
export default function DictDataRadio({ dictLabel, transValue, ...props }: IProps) {
  const {options} = useDict(dictLabel, transValue)
  return (
    <Radio.Group options={options} optionType="button" buttonStyle="solid" {...props} />
  );
}

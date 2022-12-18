import React from 'react';
import {Select} from 'antd';
import {SelectProps} from 'antd/es/select';
import {useEnum} from "@/components/base-dict/hooks";

interface IProps extends SelectProps<any> {
  enumName: string; // 枚举名称
  onFetchData?: (list: any[]) => void; // 获取数据回调
  transValue?: (v: any) => any; // value类型转换
}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictEnumApiSelector({ enumName, onFetchData, transValue, ...props }: IProps) {
  const {options} = useEnum(enumName, transValue)

  return (
    <Select
      style={{ minWidth: 170 }}
      allowClear
      placeholder="请选择"
      options={options}
      {...props}
    />
  );
}


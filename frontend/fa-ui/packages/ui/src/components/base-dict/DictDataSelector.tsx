import React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/es/select';
import { useDict } from '@ui/components/base-dict/hooks';

interface IProps extends SelectProps<any> {
  dictLabel: string; // 字典分组编码
  onFetchData?: (list: any[]) => void; // 获取数据回调
  transValue?: (v: any) => any; // value类型转换
}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictDataSelector({ dictLabel, transValue, ...props }: IProps) {
  const { options } = useDict(dictLabel, transValue);
  return <Select style={{ minWidth: 170 }} allowClear placeholder="请选择" options={options} {...props} />;
}

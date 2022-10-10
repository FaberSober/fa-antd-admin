import React, {useEffect, useState} from 'react';
import {Select} from 'antd';
import {SelectProps} from 'antd/es/select';
import dictService from '@/services/admin/dict';

interface IProps extends SelectProps<any> {
  enumName: string; // 枚举名称
  onFetchData?: (list: any[]) => void; // 获取数据回调
  onChange?: (value: any, label: any) => void;
  transValue?: (v: any) => any; // value类型转换
}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictEnumApiSelector({ enumName, onFetchData, onChange, value, transValue = (v) => v, ...props }: IProps) {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [enumName]);

  function fetchData() {
    dictService.listEnum(enumName).then((res) => {
      const newList = res.data.map((v) => ({
        value: transValue ? transValue(v.value) : v.value,
        label: v.text,
      }));
      setList(newList);
      if (onFetchData) onFetchData(newList);
    });
  }

  function handleChange(v: any, option: any) {
    if (onChange) onChange(v, option && option.label);
  }

  return (
    <Select
      style={{ minWidth: 170 }}
      onChange={handleChange}
      allowClear
      placeholder="请选择"
      value={value && `${value}`}
      options={list}
      {...props}
    />
  );
}


import React, { useEffect, useState } from 'react';
import { v1 as uuidv1 } from 'uuid';
import { Select } from 'antd';
import { RES_CODE } from '@/configs/server.config';
import { SelectProps } from 'antd/es/select';
import dictService from '@/services/admin/dict';

const { Option } = Select;

interface IProps extends SelectProps<any> {
  dictLabel: string; // 字典分组编码
  onFetchData?: (list: any[]) => void; // 获取数据回调
  onChange?: (value: any, label: any) => void;
  transValue?: (v: any) => any; // value类型转换
}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictDataSelector({ dictLabel, onFetchData, onChange, value, transValue = (v) => v, ...props }: IProps) {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [dictLabel]);

  function fetchData() {
    dictService.listByCode(dictLabel).then((res) => {
      if (res && res.status === RES_CODE.OK) {
        const newList = res.data.map((v) => ({
          value: transValue(v.value),
          label: v.text,
        }));
        setList(newList);
        if (onFetchData) onFetchData(newList);
      }
    });
  }

  function handleChange(v: any, option: any) {
    if (onChange) onChange(v, option && option.label);
  }

  const options = list.map((v) => (
    <Option key={`SysDictDataSelector_${v.value}_${uuidv1()}`} value={`${v.value}`} label={v.label}>
      {v.label}
    </Option>
  ));

  return (
    <Select style={{ minWidth: 170 }} onChange={handleChange} allowClear placeholder="请选择" value={value && `${value}`} {...props}>
      {options}
    </Select>
  );
}

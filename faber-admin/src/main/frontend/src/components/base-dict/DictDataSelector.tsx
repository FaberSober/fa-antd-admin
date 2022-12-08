import React, {useEffect, useState} from 'react';
import {Select} from 'antd';
import {RES_CODE} from '@/configs/server.config';
import {SelectProps} from 'antd/es/select';
import dictService from '@/services/admin/dict';

interface IProps extends SelectProps<any> {
  dictLabel: string; // 字典分组编码
  onFetchData?: (list: any[]) => void; // 获取数据回调
  transValue?: (v: any) => any; // value类型转换
}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictDataSelector({ dictLabel, onFetchData, transValue, ...props }: IProps) {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [dictLabel]);

  function fetchData() {
    dictService.listByCode(dictLabel).then((res) => {
      const newList = res.data.map((v) => ({
        value: transValue ? transValue(v.value) : v.value,
        label: v.text,
      }));
      setList(newList);
      if (onFetchData) onFetchData(newList);
    });
  }

  return (
    <Select
      style={{ minWidth: 170 }}
      allowClear
      placeholder="请选择"
      options={list}
      {...props}
    />
  );
}

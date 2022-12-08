import React, {useEffect, useState} from 'react';
import {Radio} from 'antd';
import dictService from '@/services/admin/dict';
import {RadioProps} from 'antd/es/radio';

export interface OptionItemProps {
  value: string;
  label: string;
  description: string;
}

export interface IProps extends RadioProps {
  dictLabel: string; // 字典分组编码
  onFetchData?: (list: any[]) => void; // 获取数据回调
  transValue?: (v: any) => any; // value类型转换
}

/**
 * @author xu.pengfei
 * @date 2020/12/27
 */
export default function DictDataRadio({ dictLabel, onFetchData, transValue, ...props }: IProps) {
  const [list, setList] = useState<OptionItemProps[]>([]);

  useEffect(() => {
    dictService.listByCode(dictLabel).then((res) => {
      const newList = res.data.map((v) => ({
        value: transValue ? transValue(v.value) : v.value,
        label: v.text,
        description: v.description,
      }));
      setList(newList);
      if (onFetchData) onFetchData(newList);
    });
  }, [dictLabel]);

  return (
    <div>
      <Radio.Group options={list} optionType="button" buttonStyle="solid" {...props} />
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Radio } from 'antd';
import { find } from 'lodash';
import dictService from '@/services/admin/dict';
import { RES_CODE } from '@/configs/server.config';
import { RadioProps } from 'antd/es/radio';

export interface OptionItemProps {
  value: string;
  label: string;
  description: string;
}

export interface IProps extends RadioProps {
  dictLabel: string; // 字典分组编码
  onFetchData?: (list: any[]) => void; // 获取数据回调
  showSuffix?: (item: OptionItemProps) => void;
  transValue?: (v: any) => any; // value类型转换
}

/**
 * @author xu.pengfei
 * @date 2020/12/27
 */
export default function DictDataRadio({ dictLabel, onFetchData, value, showSuffix, transValue = (v) => v, ...props }: IProps) {
  const [list, setList] = useState<OptionItemProps[]>([]);

  useEffect(() => {
    dictService.listByCode(dictLabel).then((res) => {
      if (res && res.status === RES_CODE.OK) {
        const newList = res.data.map((v) => ({
          value: transValue(v.value),
          label: v.text,
          description: v.description,
        }));
        setList(newList);
        if (onFetchData) onFetchData(newList);
      }
    });
  }, [dictLabel]);

  const selectedOption = find(list, (d) => d.value === value);

  return (
    <div>
      <Radio.Group options={list} value={value} optionType="button" buttonStyle="solid" {...props} />
      {selectedOption && showSuffix && showSuffix(selectedOption)}
    </div>
  );
}

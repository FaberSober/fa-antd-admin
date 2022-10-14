import React, {useEffect, useState} from 'react';
import {find, trim} from 'lodash';
import dictService from '@/services/admin/dict';
import {Fa} from "@/props/base";

interface IProps  {
  value: any;
  enumName: string; // 枚举名称
}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictEnumApiShow({ enumName, value }: IProps) {
  const [list, setList] = useState<Fa.Dict[]>([]);

  useEffect(() => {
    dictService.listEnum(enumName).then(res => setList(res.data))
  }, [enumName]);

  const item = find(list, (i) => trim(i.value) === trim(value))
  return (
    <span>{item && item.text}</span>
  );
}

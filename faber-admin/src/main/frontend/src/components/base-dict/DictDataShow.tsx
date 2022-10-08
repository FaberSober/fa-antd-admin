import React, {useEffect, useState} from 'react';
import dictService from '@/services/admin/dict';
import Admin from '@/props/admin';
import {RES_CODE} from '@/configs/server.config';

export interface DictDataShowProps {
  dictLabel: string | undefined;
  dictValue: string | undefined;
}

/**
 * 字典值展示
 * @author xu.pengfei
 * @date 2021/1/7
 */
export default function DictDataShow({ dictLabel, dictValue }: DictDataShowProps) {
  const [dict, setDict] = useState<Admin.Dict>();

  useEffect(() => {
    if (dictLabel !== undefined && dictValue !== undefined) {
      dictService.getByCodeAndValue(dictLabel, dictValue).then((res) => {
        if (res && res.status === RES_CODE.OK) {
          if (res.data && res.data[0]) {
            setDict(res.data[0]);
          }
        }
      });
    }
  }, [dictLabel, dictValue]);

  return <div>{dict?.text}</div>;
}

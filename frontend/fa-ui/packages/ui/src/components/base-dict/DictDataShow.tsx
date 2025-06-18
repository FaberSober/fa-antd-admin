import React from 'react';
import {find} from 'lodash'
import {useDict} from "@ui/components/base-dict/hooks";

export interface DictDataShowProps {
  dictLabel: string;
  dictValue: string | undefined;
}

/**
 * 字典值展示
 * @author xu.pengfei
 * @date 2021/1/7
 */
export default function DictDataShow({ dictLabel, dictValue }: DictDataShowProps) {
  const {options} = useDict(dictLabel)

  const option = find(options, o => `${o.value}` == `${dictValue}`)
  return <div>{option ? option.label : ''}</div>;
}

import React, {useContext, useEffect, useState} from 'react';
import Admin from "@/props/admin";
import dictApi from '@/services/admin/dict';
import {ApiEffectLayoutContext} from "@/layout/ApiEffectLayout";
import {FaSortList} from "@/components/base-drag";
import {Spin} from "antd";


export interface DictSortListProps {
  type: number;
}

/**
 * @author xu.pengfei
 * @date 2022/12/9 17:28
 */
export default function DictSortList({type}: DictSortListProps) {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const [array, setArray] = useState<Admin.Dict[]>([])

  useEffect(() => {
    dictApi.list({ query: { type } }).then(res => setArray(res.data))
  }, [type]);

  const loading = loadingEffect[dictApi.getUrl('list')]
  console.log(loading)
  return (
    <Spin spinning={loading || false}>
      <FaSortList
        list={array}
        renderItem={(i) => <div>{i.text}/{i.value}/{i.description}</div>}
        itemStyle={{padding: 8, borderBottom: '1px solid #ccc'}}
        onSortEnd={(l) => setArray(l)}
        vertical
      />
    </Spin>
  )
}

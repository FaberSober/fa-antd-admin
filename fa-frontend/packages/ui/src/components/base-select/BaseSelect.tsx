import React, { useEffect, useState } from 'react';
import { Select, SelectProps } from 'antd';
import { get } from 'lodash';
import { Fa } from '@fa/types';

export interface BaseSelectProps<T> extends SelectProps<T> {
  labelKey?: string | ((data: T) => any);
  valueKey?: string | ((data: T) => any);
  /** [外部定义]Tree节点标准API接口 */
  serviceApi: {
    /** [外部定义]获取所有List节点 */
    list: (p: any) => Promise<Fa.Ret<T[]>>;
  };
  value?: any;
  onChange?: (v: any, option?: any) => void;
  extraParams?: any;
  showAll?: boolean; // 是否展示所有选项
  transValueToString?: boolean; // 是否将value转换为string
}

/**
 * 带有业务接口Api调用的 下拉选择
 * @author xu.pengfei
 * @date 2020/12/28
 */
export default function BaseSelect<RecordType extends object = any>({
  labelKey = 'name',
  valueKey = 'id',
  serviceApi,
  value,
  extraParams,
  showAll,
  transValueToString,
  ...props
}: BaseSelectProps<RecordType>) {
  const [loading, setLoading] = useState(false);
  const [array, setArray] = useState<any>([]);

  useEffect(() => {
    function fetchList() {
      setLoading(true);
      serviceApi
        .list({})
        .then((res) => {
          const newList = [];
          if (showAll) {
            newList.push({ label: '全部', value: '' });
          }
          newList.push(
            ...res.data.map((c) => ({
              label: parseLabel(c),
              value: parseValue(c),
            })),
          );
          setArray(newList);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }

    fetchList();
  }, [extraParams]);

  function parseLabel(data: RecordType) {
    if (labelKey instanceof Function) {
      return labelKey(data);
    }
    return get(data, labelKey!);
  }

  function parseValue(data: RecordType) {
    if (valueKey instanceof Function) {
      return valueKey(data);
    }
    return transValueToString ? `${get(data, valueKey!)}` : get(data, valueKey!);
  }

  return (
    <Select
      allowClear
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      notFoundContent={null}
      placeholder="请选择..."
      options={array}
      value={value}
      loading={loading}
      style={{ minWidth: 170 }}
      {...props}
    />
  );
}

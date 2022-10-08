import React, {ReactNode, useEffect, useState} from 'react';
import {get, remove, trim} from 'lodash';
import {Select, SelectProps} from 'antd';
import {useDebounce} from 'react-use';
import Fa from '@/props/base/Fa';

export interface BaseSearchSelectProps<T, KeyType = number> extends SelectProps<T> {
  labelKey?: string | ((record: T) => string | ReactNode);
  valueKey?: string | ((record: T) => any);
  /** [外部定义]Tree节点标准API接口 */
  serviceApi: {
    /** [外部定义]获取所有Tree节点 */
    search: (searchValue: string) => Promise<Fa.Response<Fa.Page<T>>>;
    /** [外部定义]获取Tree节点详情 */
    findOne: (id: KeyType) => Promise<Fa.Response<T>>;
    /** [外部定义]获取Tree节点详情 */
    findList?: (ids: KeyType[]) => Promise<Fa.Response<T[]>>;
  };
  value?: any;
  onChange?: (v: any, option?: any) => void;
  onItemChange?: (v: T) => void;
  extraParams?: any;
}

/**
 * 带有业务接口Api调用的 搜索下拉选择
 * @author xu.pengfei
 * @date 2020/12/28
 */
export default function BaseSearchSelect<RecordType extends object = any, KeyType = number>({
  labelKey = 'name',
  valueKey = 'id',
  serviceApi,
  value,
  extraParams,
  onChange,
  onItemChange,
  ...props
}: BaseSearchSelectProps<RecordType, KeyType>) {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [array, setArray] = useState<any>([]);

  useEffect(() => {
    const listValueFlag = value instanceof Array;
    if (listValueFlag) {
      // 多选数据
      if (value === undefined || value === null || value.length === 0) {
        searchNow();
      } else {
        updateValue(value);
      }
    } else {
      if (value === undefined || value === null) {
        searchNow();
      } else {
        updateValue(value);
      }
    }
  }, [value, extraParams]);

  function updateValue(outValue: any) {
    if (outValue === undefined || outValue === null || trim(outValue) === '') return;
    if (outValue instanceof Array) {
      if (serviceApi?.findList) {
        serviceApi?.findList(outValue).then((res) => {
          const newList = res.data.map((d) => ({
            label: parseLabel(d),
            value: parseValue(d),
          }));

          // 追加搜索
          serviceApi?.search(search).then((res1) => {
            const newListAdd = res1.data.rows.map((c) => ({
              label: parseLabel(c),
              value: parseValue(c),
            }));
            const newListValues = newList.map((v1) => v1.value);
            remove(newListAdd, (v) => newListValues.indexOf(v.value) > -1);
            setArray([...newList, ...newListAdd]);
          }).catch(() => setArray(newList));
        });
      }
    } else {
      serviceApi?.findOne(outValue).then((res) => {
        const newList = [{ label: parseLabel(res.data), value: parseValue(res.data) }];
        setArray(newList);
      });
    }
  }

  function parseLabel(data: RecordType) {
    if (labelKey instanceof Function) {
      return labelKey(data);
    }
    return get(data, labelKey);
  }

  function parseValue(data: RecordType) {
    if (valueKey instanceof Function) {
      return valueKey(data);
    }
    return get(data, valueKey);
  }

  function searchNow() {
    setLoading(true);
    serviceApi?.search(search).then((res) => {
      const newList = res.data.rows.map((c) => ({
        label: parseLabel(c),
        value: parseValue(c),
      }));
      setArray(newList);
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  const [, cancel] = useDebounce(
    () => {
      searchNow()
    },
    250,
    [search]
  );

  function handleValueChange(v: any, item: any) {
    if (onChange) {
      onChange(v, item);
    }
    setSearch('');
  }

  return (
    // @ts-ignore
    <Select
      showSearch
      allowClear
      // value={this.state.value}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      searchValue={search}
      onSearch={(v) => {
        setLoading(true)
        setSearch(v)
      }}
      notFoundContent={null}
      placeholder="搜索..."
      options={array}
      value={value}
      loading={loading}
      style={{ minWidth: 170 }}
      onChange={handleValueChange}
      {...props}
    />
  );
}

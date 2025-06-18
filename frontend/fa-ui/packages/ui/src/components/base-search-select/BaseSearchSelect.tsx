import React, { CSSProperties, ReactNode, useEffect, useState } from 'react';
import { get, remove, trim } from 'lodash';
import { Button, Select, SelectProps, Space } from 'antd';
import { useDebounce } from 'react-use';
import { Fa } from '@ui/types';
import { SearchOutlined } from "@ant-design/icons";
import { BizUserSelect, SelectedUser } from '../biz-user-select';

export interface BaseSearchSelectProps<T, KeyType = number> extends SelectProps<T> {
  labelKey?: string | ((record: T) => string | ReactNode);
  valueKey?: string | ((record: T) => any);
  /** [外部定义]Tree节点标准API接口 */
  serviceApi: {
    /** [外部定义]获取所有Tree节点 */
    search: (searchValue: string) => Promise<Fa.Ret<Fa.Page<T>>>;
    /** [外部定义]获取Tree节点详情 */
    getById: (id: KeyType) => Promise<Fa.Ret<T>>;
    /** [外部定义]获取Tree节点详情 */
    findList?: (ids: KeyType[]) => Promise<Fa.Ret<T[]>>;
  };
  value?: any;
  onChange?: (v: any, option?: any) => void;
  // onItemChange?: (v: T) => void;
  extraParams?: any;
  bodyStyle?: CSSProperties;
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
  bodyStyle,
  ...props
}: BaseSearchSelectProps<RecordType, KeyType>) {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [array, setArray] = useState<any>([]);
  const [innerUsers, setInnerUsers] = useState<SelectedUser[]>([])

  const multiple = props.mode === 'multiple';

  useEffect(() => {
    // console.log('listValueFlag', listValueFlag, value, extraParams)
    if (multiple) {
      // 多选数据
      if (value === undefined || value === null || value.length === 0) {
        searchNow();
        // if (onChange) {
        //   onChange([])
        // }
      } else {
        updateValue(value);
        setInnerUsers(value.map((i:any) => ({ id: i, allowRemove: true })))
      }
    } else {
      if (value === undefined || value === null) {
        searchNow();
        if (onChange) {
          onChange(undefined)
        }
      } else {
        updateValue(value);
        setInnerUsers([{ id: value, allowRemove: true }])
      }
    }
  }, [value, extraParams]);

  function updateValue(outValue: any) {
    if (outValue === undefined || outValue === null || trim(outValue) === '') return;
    if (multiple) {
      if (serviceApi?.findList) {
        serviceApi?.findList(outValue).then((res) => {
          const newList = res.data.map((d) => ({
            label: parseLabel(d),
            value: parseValue(d),
          }));

          // 追加搜索
          serviceApi
            ?.search(search)
            .then((res1) => {
              const newListAdd = res1.data.rows.map((c) => ({
                label: parseLabel(c),
                value: parseValue(c),
              }));
              const newListValues = newList.map((v1) => v1.value);
              remove(newListAdd, (v) => newListValues.indexOf(v.value) > -1);
              setArray([...newList, ...newListAdd]);
            })
            .catch(() => setArray(newList));
        });
      }
    } else {
      serviceApi?.getById(outValue).then((res) => {
        const newList = [{ label: parseLabel(res.data), value: parseValue(res.data) }];
        setArray(newList);
      });
    }
  }

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
    return get(data, valueKey!);
  }

  function searchNow() {
    setLoading(true);
    serviceApi
      ?.search(search)
      .then((res) => {
        const newList = res.data.rows.map((c) => ({
          label: parseLabel(c),
          value: parseValue(c),
        }));
        setArray(newList);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  const [,] = useDebounce(
    () => {
      searchNow();
    },
    500,
    [search],
  );

  function handleValueChange(v: any, item: any) {
    // console.log('handleValueChange', v, item)
    if (onChange) {
      onChange(v, item);
    }
    if (search !== '') {
      setSearch('');
    }
  }

  function handleAddUsers(users: SelectedUser[], callback: any, error: any) {
    if (multiple) {
      onChange && onChange(users.map(i => i.id), users)
    } else {
      if (users && users[0]) {
        onChange && onChange(users[0].id, users[0])
      } else {
        onChange && onChange(undefined, undefined)
      }
    }
    callback()
  }

  return (
    <Space.Compact block style={bodyStyle}>
      <Select
        showSearch
        allowClear
        // value={this.state.value}
        defaultActiveFirstOption={false}
        // showArrow={false}
        filterOption={false}
        searchValue={search}
        onSearch={(v) => {
          setLoading(true);
          setSearch(v);
        }}
        notFoundContent={null}
        placeholder="搜索..."
        options={array}
        value={value}
        loading={loading}
        style={{ minWidth: 138 }}
        onChange={handleValueChange}
        {...props}
      />
      <BizUserSelect
        onChange={handleAddUsers}
        selectedUsers={innerUsers}
      >
        <Button icon={<SearchOutlined />} />
      </BizUserSelect>
    </Space.Compact>
  );
}

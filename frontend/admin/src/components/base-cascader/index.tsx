import React, {useEffect, useState} from 'react';
import {isNil} from 'lodash';
import Fa from '@/props/base/Fa';
import {CascaderProps} from 'antd/es/cascader';
import {Cascader} from 'antd';
import * as BaseTreeUtils from '@/components/base-tree/utils';
import {setTreeDisabled} from "@/components/base-tree/utils";



export interface BaseCascaderProps<T, KeyType = number> extends Omit<CascaderProps<T>, 'options'|'onChange'> {
  showRoot?: boolean;
  /** [外部定义]Tree节点标准API接口 */
  serviceApi: {
    /** [外部定义]获取所有Tree节点 */
    allTree: (params: any) => Promise<Fa.Ret<Fa.TreeNode<T, KeyType>[]>>;
    /** [外部定义]获取Tree节点详情 */
    getById: (id: KeyType) => Promise<Fa.Ret<T>>;
  };
  value?: any;
  onChange?: (v: KeyType|undefined, lastItem: T|undefined, vList: KeyType[], itemList: T[]) => void;
  onChangeWithItem?: (key: KeyType|undefined, data: T|undefined) => void;
  rootId?: KeyType;
  rootName?: string;
  extraParams?: any; // 补充副作用参数，变更会触发cascader重新拉取api tree数据
  disabledIds?: any[]; // 禁止选择的选项IDs
}

/**
 * 带业务请求的Cascade（适用业务数据量少，一次加载所有数据）
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function BaseCascader<RecordType extends object = any, KeyType = number>({
  showRoot,
  serviceApi,
  value,
  onChange,
  onChangeWithItem,
  // @ts-ignore
  rootId = Fa.Constant.TREE_SUPER_ROOT_ID,
  rootName = Fa.Constant.TREE_SUPER_ROOT_LABEL,
  extraParams,
  disabledIds,
  ...props
}: BaseCascaderProps<RecordType, KeyType>) {
  const [innerValue, setInnerValue] = useState<any[]>([]);
  const [options, setOptions] = useState<Fa.TreeNode<RecordType, KeyType>[] | undefined>([]);

  useEffect(() => {
    setValuePath(value);
  }, [value, options]);

  useEffect(() => {
    fetchTreeData();
  }, [extraParams]);

  function fetchTreeData() {
    serviceApi.allTree({}).then((res) => {
      let treeArr = res.data
      if (showRoot) {
        treeArr = [{ ...Fa.ROOT_DEFAULT, id: rootId, name: rootName, children: res.data } as any];
      }
      setTreeDisabled(treeArr, disabledIds)
      setOptions(treeArr)
    });
  }

  function setValuePath(v: any) {
    if (isNil(v)) return;
    const path = BaseTreeUtils.findPath(options, value, 'id');
    const values = path.map((d: any) => d.id);
    setInnerValue(values);
  }

  function handleChange(newValue: KeyType[], selectedOptions: Fa.TreeNode<RecordType, KeyType>[]) {
    setInnerValue(newValue);
    const lastValue = newValue[newValue.length - 1];
    const lastItem = selectedOptions[selectedOptions.length - 1];
    if (onChange) onChange(lastValue, lastItem, newValue, selectedOptions.map(i => i.sourceData));
    if (onChangeWithItem) onChangeWithItem(lastValue, lastItem.sourceData);
  }

  return (
    <Cascader
      fieldNames={{ label: 'name', value: 'id' }}
      placeholder="请选择"
      {...props}
      value={innerValue}
      options={options}
      onChange={handleChange}
      changeOnSelect
    />
  );
}

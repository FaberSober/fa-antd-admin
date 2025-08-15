import React, { useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
import { Fa } from '@ui/types';
import { TreeSelectProps } from 'antd/es/tree-select';
import * as BaseTreeUtils from '@ui/components/base-tree/utils';
import BaseTreeProps from '@ui/types/core/BaseTreeProps';
import { filterNode } from "@ui/components/base-tree/utils";

export interface BaseTreeSelectProps<T, KeyType = number> extends Omit<TreeSelectProps<T>, 'options'> {
  value?: any;
  onChange?: (v: any) => void;
  /** [外部定义]Tree节点标准API接口 */
  serviceApi: {
    /** [外部定义]获取所有Tree节点 */
    allTree: (params: any) => Promise<Fa.Ret<Fa.TreeNode<T, KeyType>[]>>;
  };
  showRoot?: boolean;
  rootName?: string;
  extraEffectArgs?: any[];
  getValue?: (item: T) => any; // 自定义value取值
}

/**
 * @author xu.pengfei
 * @date 2021/5/13
 */
export default function BaseTreeSelect<RecordType extends object = any, KeyType = number>({
  value,
  onChange,
  serviceApi,
  showRoot,
  rootName = Fa.Constant.TREE_SUPER_ROOT_LABEL,
  extraEffectArgs = [],
  getValue,
  ...props
}: BaseTreeSelectProps<RecordType, KeyType>) {
  const [options, setOptions] = useState<BaseTreeProps.TreeNode[] | undefined>([]);

  useEffect(() => {
    serviceApi.allTree({}).then((res) => {
      let treeArr = BaseTreeUtils.parseNode(res.data);
      if (showRoot) {
        treeArr = [{ ...{ ...Fa.ROOT_DEFAULT, label: rootName }, children: treeArr, level: 0 }];
      }
      // 自定义value转换
      if (getValue) {
        filterNode(treeArr as any, (d: any) => {
          d.value = getValue(d.sourceData);
        })
      }
      setOptions(treeArr);
    });
  }, [...extraEffectArgs]);

  function handleOnChange(newValue: any) {
    if (onChange) {
      onChange(newValue);
    }
  }

  return (
    <TreeSelect
      style={{ width: '100%' }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeData={options}
      placeholder="请选择"
      treeDefaultExpandAll
      onChange={handleOnChange}
      {...props}
    />
  );
}

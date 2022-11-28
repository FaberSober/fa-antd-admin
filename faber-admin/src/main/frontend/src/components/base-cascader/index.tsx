import React, {useEffect, useState} from 'react';
import {isNil} from 'lodash';
import Fa from '@/props/base/Fa';
import {CascaderProps} from 'antd/es/cascader';
import {Cascader} from 'antd';
import * as BaseTreeUtils from '@/components/base-tree/utils';
import BaseTreeProps from '../base-tree/interface';
import {RES_CODE} from '@/configs/server.config';

export interface BaseCascaderProps<T, KeyType = number> extends Omit<CascaderProps<T>, 'options'> {
  showRoot?: boolean;
  /** [外部定义]Tree节点标准API接口 */
  serviceApi: {
    /** [外部定义]获取所有Tree节点 */
    allTree: (params: any) => Promise<Fa.Ret<Fa.TreeNode<T, KeyType>[]>>;
    /** [外部定义]获取Tree节点详情 */
    findOne: (id: KeyType) => Promise<Fa.Ret<T>>;
  };
  value?: any;
  onChange?: (v: any) => void;
  onChangeWithItem?: (key: KeyType|undefined, data: T|undefined) => void;
  rootName?: string;
  extraParams?: any;
  rootId?: number;
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
  rootName = Fa.Constant.TREE_SUPER_ROOT_LABEL,
  rootId = Fa.Constant.TREE_SUPER_ROOT_ID,
  extraParams,
  ...props
}: BaseCascaderProps<RecordType, KeyType>) {
  const [innerValue, setInnerValue] = useState<any[]>([]);
  const [options, setOptions] = useState<BaseTreeProps.TreeNode[] | undefined>([]);

  useEffect(() => {
    setValuePath(value);
  }, [value, options]);

  useEffect(() => {
    fetchTreeData();
  }, [extraParams]);

  function fetchTreeData() {
    serviceApi.allTree({}).then((res) => {
      if (res && res.status === RES_CODE.OK) {
        let treeArr = BaseTreeUtils.parseNode(res.data);
        if (showRoot) {
          treeArr = [{ ...Fa.ROOT_DEFAULT, value: rootId, label: rootName, children: treeArr }];
        }
        setOptions(treeArr);
      }
    });
  }

  function setValuePath(v: any) {
    if (isNil(v)) return;
    // 递归查询
    const path = BaseTreeUtils.findPath(options, value);
    const values = path.map((d: any) => d.value);
    setInnerValue(values);
  }

  function handleChange(newValue: any) {
    setInnerValue(newValue);
    if (onChange) onChange(newValue[newValue.length - 1]);
    // 获取Item信息
    if (onChangeWithItem) {
      const key = newValue[newValue.length - 1];
      if (key !== undefined) {
        serviceApi.findOne(key).then((res) => {
          if (res && res.status === RES_CODE.OK) {
            onChangeWithItem(key, res.data);
          }
        });
      } else {
        onChangeWithItem(undefined, undefined);
      }
    }
  }

  return <Cascader placeholder="请选择" {...props} value={innerValue} options={options} onChange={handleChange} changeOnSelect />;
}

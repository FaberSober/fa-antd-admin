import React, { useEffect, useState } from 'react';
import { isNil } from 'lodash';
import Ajax from '@/props/base/Ajax';
import FaberBase from '@/props/base/FaberBase';
import { CascaderProps } from 'antd/es/cascader';
import { Cascader } from 'antd';
import * as BaseTreeUtils from '@/components/biz/base-tree/utils';
import BaseTreeProps from '../base-tree/interface';
import { RES_CODE } from '@/configs/server.config';

const root = { value: 0, label: '根节点', isLeaf: false, hasChildren: true };

export interface BaseCascaderProps<T, KeyType = number> extends Omit<CascaderProps, 'options'> {
  showRoot?: boolean;
  /** [外部定义]Tree节点标准API接口 */
  serviceApi: {
    /** [外部定义]获取所有Tree节点 */
    allTree: (params: any) => Promise<Ajax.Response<FaberBase.TreeNode<T, KeyType>[]>>;
    /** [外部定义]获取Tree节点详情 */
    findOne: (id: KeyType) => Promise<Ajax.Response<T>>;
  };
  value?: any;
  onChange?: (v: any) => void;
  onChangeWithItem?: (key: any, data: any) => void;
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
  rootName = '根节点',
  rootId = 0,
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
          treeArr = [{ ...root, value: rootId, label: rootName, children: treeArr }];
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

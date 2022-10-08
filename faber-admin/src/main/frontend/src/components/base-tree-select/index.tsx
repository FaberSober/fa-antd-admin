import React, { useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
import Ajax from "@/props/base/Ajax";
import FaberBase from '@/props/base/FaberBase';
import { TreeSelectProps } from 'antd/es/tree-select';
import BaseTreeProps from '@/components/base-tree/interface';
import { RES_CODE } from '@/configs/server.config';
import * as BaseTreeUtils from '@/components/base-tree/utils';

export interface BaseTreeSelectProps<T, KeyType = number> extends Omit<TreeSelectProps<T>, 'options'> {
  value?: any;
  onChange?: (v: any) => void;
  /** [外部定义]Tree节点标准API接口 */
  serviceApi: {
    /** [外部定义]获取所有Tree节点 */
    allTree: (params: any) => Promise<FaberBase.Response<FaberBase.TreeNode<T, KeyType>[]>>;
  };
  showRoot?: boolean;
  rootName?: string;
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
  rootName = FaberBase.Constant.TREE_SUPER_ROOT_LABEL,
  ...props
}: BaseTreeSelectProps<RecordType, KeyType>) {
  const [options, setOptions] = useState<BaseTreeProps.TreeNode[] | undefined>([]);

  useEffect(() => {
    serviceApi.allTree({}).then((res) => {
      if (res && res.status === RES_CODE.OK) {
        let treeArr = BaseTreeUtils.parseNode(res.data);
        if (showRoot) {
          treeArr = [{ ...{ ...FaberBase.ROOT_DEFAULT, label: rootName }, children: treeArr }];
        }
        setOptions(treeArr);
      }
    });
  }, []);

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

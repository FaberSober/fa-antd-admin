import React, { useEffect, useState } from 'react';
import { cloneDeep, isNil, remove } from 'lodash';
import { Cascader, message } from 'antd';
import { type BaseCascaderProps, Fa } from '@fa/ui';
import type { Admin } from '@/types';
import type { BaseOptionType } from 'antd/es/cascader';
import { areaApi } from '@features/fa-admin-pages/services';

function getLastValue(values: number[]) {
  if (isNil(values)) return undefined;
  remove(values, (d) => isNil(d) || d === undefined);
  return values[values.length - 1];
}

const CHINA_AD_CODE = 100000000000;
const ROOT_CHINA = { label: '中国', value: CHINA_AD_CODE, isLeaf: false, children: undefined };

export interface AreaCascaderProps<T extends BaseOptionType> extends Omit<BaseCascaderProps<T>, 'serviceApi'> {
  showRoot?: boolean; // 是否展示根节点-中国
  leafLevel?: number;
  leafPath?: boolean; // 是否返回完整的路径
  /** [外部定义]Tree节点标准API接口 */
  value?: any;
  onChange?: (v: any, item?: any) => void;
  onChangeWithItem?: (key: number | undefined, data: T | undefined) => void;
}

/**
 * 中国地区选择
 * @author xu.pengfei
 * @date 2020/12/28
 */
export default function AreaCascader({ showRoot, leafLevel = 4, leafPath, value, onChange, onChangeWithItem, ...props }: AreaCascaderProps<Admin.Area>) {
  const [array, setArray] = useState<any[] | undefined>([]);
  const [innerValue, setInnerValue] = useState<any[]>();

  useEffect(() => {
    if (innerValue === undefined) {
      const areaCode = leafPath ? getLastValue(value) : value;
      setValue(areaCode);
    } else {
      const areaCode = leafPath ? getLastValue(value) : value;
      if (!isNil(areaCode)) {
        areaApi.findOnePath(areaCode).then((res) => {
          const values = res.data.list.map((d) => d.areaCode);
          setInnerValue(showRoot ? [CHINA_AD_CODE, ...values] : values);
        });
      }
    }
  }, [value]);

  function parseTree(tree: Fa.TreeNode[] | undefined): any[] | undefined {
    if (tree === undefined || tree === null || tree.length === 0) return undefined;
    return tree.map((d) => ({
      label: d.name,
      value: d.id,
      isLeaf: !d.hasChildren,
      children: parseTree(d.children),
    }));
  }

  function setValue(newValue: number) {
    // 获取值的节点路径
    if (newValue) {
      areaApi.findOnePath(newValue).then((res) => {
        const values = res.data.list.map((d) => d.areaCode);
        const options = parseTree(res.data.tree);
        setInnerValue(showRoot ? [CHINA_AD_CODE, ...values] : values);
        setArray(showRoot ? [{ ...ROOT_CHINA, children: options?.length === 0 ? undefined : options }] : options);
      });
    } else {
      // 获取省级根节点
      areaApi.list({ query: { level: 0 }, sorter: 'area_code ASC' }).then((res) => {
        if (res && res.status === Fa.RES_CODE.OK) {
          const options = res.data.map((d) => ({
            label: d.name,
            value: d.areaCode,
            isLeaf: d.level === leafLevel, // 村级别才是叶子节点
          }));
          setInnerValue([]);
          setArray(showRoot ? [{ ...ROOT_CHINA, children: options.length === 0 ? undefined : options }] : options);
        }
      });
    }
  }

  function loadData(selectedOptions: any[]) {
    loadChildren(selectedOptions);
  }

  function loadChildren(selectedOptions: any[]) {
    // console.log('selectedOptions', selectedOptions);
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (targetOption.children && targetOption.children[0]) return;

    targetOption.loading = true;
    areaApi.list({ query: { parentCode: targetOption.value }, sorter: 'area_code ASC' }).then((res) => {
      // load options lazily
      targetOption.loading = false;
      targetOption.children = res.data.map((d) => ({
        label: d.name,
        value: d.areaCode,
        isLeaf: d.level === leafLevel, // 村级别才是叶子节点
      }));
      if (res.data.length === 0) {
        targetOption.isLeaf = true;
        message.info('无下级区域');
      }
      setArray(cloneDeep(array));
    });
  }

  function handleChange(areaCodeList: number[], areaList: Admin.Area[]) {
    setInnerValue(areaCodeList);
    // 需要返回路径
    if (leafPath) {
      if (onChange) onChange(areaCodeList, areaList);
      return;
    }

    if (areaCodeList && areaCodeList[0]) {
      const lastValue = areaCodeList[areaCodeList.length - 1];
      const lastItem = areaList[areaList.length - 1];
      if (onChange) onChange(lastValue, lastItem);
      if (onChangeWithItem) onChangeWithItem(lastValue, lastItem);
    } else {
      if (onChange) onChange(undefined, undefined);
      if (onChangeWithItem) onChangeWithItem(undefined, undefined);
    }
  }

  return (
    <Cascader
      placeholder="请选择区域"
      {...props}
      value={innerValue}
      options={array}
      loadData={loadData}
      onChange={(v: any, os: any) => handleChange(v, os)}
      changeOnSelect
    />
  );
}

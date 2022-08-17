import React, { useEffect, useState } from 'react';
import { isNil, remove, cloneDeep } from 'lodash';
import { Cascader } from 'antd';
import FaberBase from '@/props/base/FaberBase';
import Admin from '@/props/admin';
import areaService from '@/services/admin/area';
import { RES_CODE } from '@/configs/server.config';
import { CascaderOptionType } from 'antd/lib/cascader';
import { BaseCascaderProps } from '@/components/biz/base-cascader';

function getLastValue(values: number[]) {
  remove(values, (d) => isNil(d) || d === undefined);
  return values[values.length - 1];
}

const CHINA_AD_CODE = 100000000000;
const ROOT_CHINA = { label: '中国', value: CHINA_AD_CODE, isLeaf: false, children: undefined };

export interface IProps<T> extends Omit<BaseCascaderProps<Admin.Area>, 'serviceApi'> {
  showRoot?: boolean; // 是否展示根节点-中国
  leaflevel?: number;
  leafpath?: boolean; // 是否返回完整的路径
  /** [外部定义]Tree节点标准API接口 */
  value?: any;
  onChange?: (v: any, item?: any) => void;
  onChangeWithItem?: (key: number | undefined, data: Admin.Area | undefined) => void;
}

/**
 * 中国地区选择
 * @author xu.pengfei
 * @date 2020/12/28
 */
export default function AreaCascader({ showRoot, leaflevel = 4, leafpath, value, onChange, onChangeWithItem, ...props }: IProps<Admin.Area>) {
  const [array, setArray] = useState<any[] | undefined>([]);
  const [innerValue, setInnerValue] = useState<any[]>();

  useEffect(() => {
    if (innerValue === undefined) {
      const areaCode = leafpath ? getLastValue(value) : value;
      setValue(areaCode);
    } else {
      const areaCode = leafpath ? getLastValue(value) : value;
      areaService.findOnePath(areaCode).then((res) => {
        if (res && res.status === RES_CODE.OK) {
          const values = res.data.list.map((d) => d.areaCode);
          setInnerValue(showRoot ? [CHINA_AD_CODE, ...values] : values);
        }
      });
    }
  }, [value]);

  function parseTree(tree: FaberBase.TreeNode[] | undefined): any[] | undefined {
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
      areaService.findOnePath(newValue).then((res) => {
        if (res && res.status === RES_CODE.OK) {
          const values = res.data.list.map((d) => d.areaCode);
          const options = parseTree(res.data.tree);
          setInnerValue(showRoot ? [CHINA_AD_CODE, ...values] : values);
          setArray(showRoot ? [{ ...ROOT_CHINA, children: options?.length === 0 ? undefined : options }] : options);
        }
      });
    } else {
      // 获取省级根节点
      areaService.list({ level: 0, sorter: 'area_code ASC' }).then((res) => {
        if (res && res.status === RES_CODE.OK) {
          const options = res.data.map((d) => ({
            label: d.name,
            value: d.areaCode,
            isLeaf: d.level === leaflevel, // 村级别才是叶子节点
          }));
          setInnerValue([]);
          setArray(showRoot ? [{ ...ROOT_CHINA, children: options.length === 0 ? undefined : options }] : options);
        }
      });
    }
  }

  function loadData(selectedOptions: CascaderOptionType[]) {
    loadChildren(selectedOptions);
  }

  function loadChildren(selectedOptions: CascaderOptionType[]) {
    // console.log('selectedOptions', selectedOptions);
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (targetOption.children && targetOption.children[0]) return;

    targetOption.loading = true;
    areaService.list({ parentCode: targetOption.value, sorter: 'area_code ASC' }).then((res) => {
      if (res && res.status === RES_CODE.OK) {
        // load options lazily
        targetOption.loading = false;
        targetOption.children = res.data.map((d) => ({
          label: d.name,
          value: d.areaCode,
          isLeaf: d.level === leaflevel, // 村级别才是叶子节点
        }));
        setArray(cloneDeep(array));
      }
    });
  }

  function handleChange(areaCodeList: number[]) {
    setInnerValue(areaCodeList);
    // 需要返回路径
    if (leafpath) {
      if (onChange) onChange(areaCodeList);
      return;
    }

    if (areaCodeList && areaCodeList[0]) {
      if (onChange) onChange(areaCodeList[areaCodeList.length - 1]);
      if (onChangeWithItem) {
        const key = areaCodeList[areaCodeList.length - 1];
        areaService.findByAreaCode(key).then((res) => {
          if (res && res.status === RES_CODE.OK) {
            onChangeWithItem(key, res.data);
          }
        });
      }
    } else {
      if (onChange) {
        onChange(undefined);
      }
      if (onChangeWithItem) {
        onChangeWithItem(undefined, undefined);
      }
    }
  }

  return (
    <Cascader
      placeholder="请选择区域"
      {...props}
      value={innerValue}
      options={array}
      // @ts-ignore
      loadData={loadData}
      // @ts-ignore
      onChange={handleChange}
      changeOnSelect
    />
  );
}

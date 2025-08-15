import React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/es/select';
import { useDict } from '@ui/components/base-dict/hooks';
import { Admin, FaEnums } from "@ui/types";
import { BaseCascader, BaseTreeSelect } from "@ui/components";
import { dictDataApi } from "@ui/services/base";

interface IProps extends SelectProps<any> {
  dictLabel: string; // 字典分组编码
  onFetchData?: (list: any[]) => void; // 获取数据回调
  transValue?: (v: any) => any; // value类型转换
  treeShowType?: 'cascader' | 'treeSelect'; // tree show type
}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictDataSelector({ dictLabel, transValue, treeShowType, ...props }: IProps) {
  const { dict, options } = useDict(dictLabel, transValue);

  if (!dict) return null;
  if (dict.type === FaEnums.DictTypeEnum.OPTIONS || dict.type === FaEnums.DictTypeEnum.LINK_OPTIONS) {
    return <Select style={{ minWidth: 170 }} allowClear placeholder="请选择" options={options} {...props} />;
  }
  if (dict.type === FaEnums.DictTypeEnum.LINK_TREE) {
    if (treeShowType === 'treeSelect') {
      return <BaseTreeSelect<Admin.DictData>
        serviceApi={{
          ...dictDataApi,
          allTree: () => dictDataApi.getTree({ query: { dictId: dict.id, valid: true } }),
        }}
        style={{ minWidth: 170 }}
        allowClear
        placeholder="请选择"
        getValue={(i) => i.value}
        {...props as any}
      />
    }
    return (
      <BaseCascader<Admin.DictData>
        serviceApi={{
          ...dictDataApi,
          allTree: () => dictDataApi.getTree({ query: { dictId: dict.id, valid: true } }),
        }}
        style={{ minWidth: 170 }}
        allowClear
        placeholder="请选择"
        getValue={(i) => i.value}
        {...props as any}
      />
    )
  }

  return <div>不支持下拉选择的字典类型，请检查{dictLabel}</div>
}

import React from 'react';
import modelService from "@/services/demo/tree";
import BaseCascader, {BaseCascaderProps} from '@/components/base-cascader';
import Demo from "@/props/demo";

export interface DictTypeCascadeProps extends Omit<BaseCascaderProps<Demo.Tree>, 'serviceApi'> {}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function TreeCascade(props: DictTypeCascadeProps) {
  return <BaseCascader showRoot serviceApi={modelService} {...props} />;
}

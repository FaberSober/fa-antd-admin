import React from 'react';
import modelService from '@/services/admin/group';
import BaseCascader, { BaseCascaderProps } from '@/components/base-cascader';
import Admin from '@/props/admin';

export interface GroupCascadeProps extends Omit<BaseCascaderProps<Admin.Group>, 'serviceApi'> {
  extraParams: {
    groupType: Admin.GroupTypeEnums;
  };
}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function GroupCascade({ extraParams, ...props }: GroupCascadeProps) {
  return (
    <BaseCascader
      showRoot
      serviceApi={{
        allTree: () => modelService.getTree(extraParams),
        findOne: (id: number) => modelService.findOne(id),
      }}
      {...props}
    />
  );
}

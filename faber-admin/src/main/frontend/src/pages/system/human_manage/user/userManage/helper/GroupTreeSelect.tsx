import React from 'react';
import Admin from '@/props/admin';
import BaseTreeSelect, { BaseTreeSelectProps } from '@/components/biz/base-tree-select';
import modelService from '@/services/admin/group';

export interface GroupTreeSelectProps extends Omit<BaseTreeSelectProps<Admin.Group>, 'serviceApi'> {
  extraParams: {
    groupType: Admin.GroupTypeEnums;
  };
}

/**
 * @author xu.pengfei
 * @date 2021/5/13
 */
export default function GroupTreeSelect({ extraParams, ...props }: GroupTreeSelectProps) {
  return (
    <BaseTreeSelect
      serviceApi={{
        allTree: () => modelService.getTree(extraParams),
      }}
      {...props}
    />
  );
}

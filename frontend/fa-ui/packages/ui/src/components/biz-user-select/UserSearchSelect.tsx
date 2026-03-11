import React from 'react';
import { BaseUserSearchSelect, BaseUserSearchSelectProps } from '@ui/components/base-search-select';
import { userApi } from '@ui/services/base';
import { Admin } from '@ui/types';

export interface UserSearchSelectProps extends Omit<BaseUserSearchSelectProps<Admin.User, string>, 'serviceApi'> {}

/**
 * @author xu.pengfei
 * @date 2020/12/28
 */
export default function UserSearchSelect(props: UserSearchSelectProps) {
  return (
    <BaseUserSearchSelect<Admin.User, string>
      valueKey="id"
      labelKey="name"
      serviceApi={{
        search: (searchValue) => userApi.page({ current: 1, pageSize: 20, query: { name: searchValue } }),
        getById: (value) => userApi.getById(value),
        findList: (ids) => userApi.list({ 'id#$in': [...ids] }),
      }}
      placeholder="请输入员工名称进行搜索"
      {...props}
    />
  );
}

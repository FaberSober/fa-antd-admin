import React from 'react';
import { BaseSearchSelect, BaseSearchSelectProps } from '@ui/components/base-search-select';
import { Admin } from '@ui/types';
import { userApi } from '@ui/services/base';

export interface UserSearchSelectProps extends Omit<BaseSearchSelectProps<Admin.User, string>, 'serviceApi'> {}

/**
 * @author xu.pengfei
 * @date 2020/12/28
 */
export default function UserSearchSelect(props: UserSearchSelectProps) {
  return (
    <BaseSearchSelect<Admin.User, string>
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

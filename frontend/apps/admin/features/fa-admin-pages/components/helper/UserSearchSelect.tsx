import React from 'react';
import { BaseSearchSelect, type BaseSearchSelectProps } from '@fa/ui';
import type { Admin } from '@/types';
import { userApi as api } from '@features/fa-admin-pages/services';

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
        search: (searchValue) => api.page({ current: 1, pageSize: 20, query: { name: searchValue } }),
        getById: (value) => api.getById(value),
        findList: (ids) => api.list({ 'id#$in': [...ids] }),
      }}
      placeholder="请输入员工名称进行搜索"
      {...props}
    />
  );
}

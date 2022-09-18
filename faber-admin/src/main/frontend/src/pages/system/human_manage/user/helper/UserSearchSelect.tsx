import React from 'react';
import BaseSearchSelect, { BaseSearchSelectProps } from '@/components/biz/base-search-select';
import modalService from '@/services/admin/user';
import Admin from '@/props/admin';

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
        search: (searchValue) => modalService.page({ currentPage: 1, pageSize: 20, name: searchValue }),
        findOne: (value) => modalService.findOne(value),
        findList: (ids) => modalService.list({ 'id#$in': [...ids] }),
      }}
      placeholder="请输入员工名称进行搜索"
      {...props}
    />
  );
}

import React from 'react';
import BaseSearchSelect, {BaseSearchSelectProps} from '@/components/base-search-select';
import api from '@/services/demo/student';
import * as Demo from "../../../../../../types/demo";

export interface IProps extends Omit<BaseSearchSelectProps<Demo.Student, number>, 'serviceApi'> {}

/**
 * @author xu.pengfei
 * @date 2020/12/28
 */
export default function StudentSearchSelect(props: IProps) {
  return (
    <BaseSearchSelect
      valueKey="id"
      labelKey="name"
      serviceApi={{
        search: (searchValue) => api.page({ current: 1, pageSize: 20, query: { name: searchValue } }),
        getById: (value) => api.getById(value),
        findList: (ids) => api.list({ 'id#$in': [...ids] }),
      }}
      placeholder="请输入学生名称进行搜索"
      {...props}
    />
  );
}

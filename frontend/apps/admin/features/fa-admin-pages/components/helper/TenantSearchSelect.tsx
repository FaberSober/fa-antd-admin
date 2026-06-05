import React from 'react';
import { BaseSearchSelect, type BaseSearchSelectProps } from '@fa/ui';
import type { Tn } from '@/types';
import { tenantApi } from '@features/fa-admin-pages/services';

export interface TenantSearchSelectProps extends Omit<BaseSearchSelectProps<Tn.Tenant, string>, 'serviceApi'> {}

export default function TenantSearchSelect(props: TenantSearchSelectProps) {
  return (
    <BaseSearchSelect<Tn.Tenant, string>
      valueKey="id"
      labelKey="name"
      serviceApi={{
        search: (searchValue) => tenantApi.page({ current: 1, pageSize: 20, query: { name: searchValue } }),
        getById: (value) => tenantApi.getById(value),
        findList: (ids) => tenantApi.list({ 'id#$in': [...ids] }),
      }}
      placeholder="请输入租户名称进行搜索"
      {...props}
    />
  );
}

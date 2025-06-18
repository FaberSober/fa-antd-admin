# select

## 通用业务数据Select查询框
```typescript jsx
import React from 'react';
import { BaseSelect, BaseSelectProps } from '@fa/ui';
import { Rbac } from '@/types';
import { userApi as api } from '@/services';

/**
 * @author xu.pengfei
 * @date 2022/9/28
 */
export default function UserSelect({ ...props }: Omit<BaseSelectProps<Rbac.RbacRole>, 'serviceApi'>) {
  return <BaseSelect serviceApi={api} placeholder="请选择用户" {...props} />;
}
```

## 通用业务数据Select查询框-外部传入其他参数
```typescript jsx
import React from 'react';
import { BaseSelect, BaseSelectProps } from '@fa/ui';
import { Rbac } from '@/types';
import { userApi as api } from '@/services';


export interface UserSelect extends Omit<BaseSelectProps<Rbac.RbacRole>, 'serviceApi'> {
  departmentId?: string; // 外部传入其他参数
}

/**
 * @author xu.pengfei
 * @date 2022/9/28
 */
export default function UserSelect({ departmentId, ...props }: UserSelect) {
  return (
    <BaseSelect
      serviceApi={{
        ...api,
        list: () => api.list({ query: { departmentId } })
      }}
      placeholder="请选择用户"
      extraParams={[departmentId]} // 外部传入其他参数变更会触发Select重新获取数据
      {...props}
    />
  );
}
```

## 通用业务数据搜索SearchSelect查询框
```typescript jsx
import React from 'react';
import { BaseSearchSelect, BaseSearchSelectProps } from '@fa/ui';
import { Admin } from '@/types';
import { userApi as api } from '@/services';

/**
 * @author xu.pengfei
 * @date 2020/12/28
 */
export default function UserSearchSelect(props: Omit<BaseSearchSelectProps<Admin.User, string>, 'serviceApi'>) {
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
```

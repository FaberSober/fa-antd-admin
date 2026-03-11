import React from 'react';
import { BaseSelect, BaseSelectProps, Fa } from '@fa/ui';
import { rbacMenuApi } from '@/services';

/**
 * @author xu.pengfei
 * @date 2026/01/12
 */
export default function RbacFlowMenuSelect({ ...props }: Omit<BaseSelectProps<Fa.Option>, 'serviceApi'>) {
  return <BaseSelect serviceApi={{ list: rbacMenuApi.getFlowMenuList }} placeholder="请选择流程菜单" {...props} />;
}

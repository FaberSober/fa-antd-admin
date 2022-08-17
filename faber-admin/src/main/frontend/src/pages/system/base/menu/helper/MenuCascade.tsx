import React from 'react';
import modelService from '@/services/admin/menu';
import BaseCascader, { BaseCascaderProps } from '@/components/biz/base-cascader';
import Admin from '@/props/admin';
import menuService from "@/services/admin/menu";

export interface MenuCascadeProps extends Omit<BaseCascaderProps<Admin.Menu>, 'serviceApi'> {
  blockId: number,
}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function MenuCascade({ blockId, ...props }: MenuCascadeProps) {
  return (
    <BaseCascader
      showRoot
      serviceApi={{
        ...menuService,
        allTree: () => menuService.blockAllTree(blockId)
      }}
      extraParams={blockId}
      {...props}
    />
  );
}

import React from 'react';
import BaseCascader from '@/components/biz/base-cascader';
import modelService from '@/services/article/outline';

interface OutlineCascadeProps {
  bookId: number | undefined;
}

/**
 * @author xu.pengfei
 * @date 2020/12/31
 */
export default function OutlineCascade({ bookId, ...props }: OutlineCascadeProps) {
  return (
    <BaseCascader
      showRoot
      serviceApi={{
        ...modelService,
        allTree: () => modelService.allBookIdTree(bookId || 0),
      }}
      {...props}
    />
  );
}

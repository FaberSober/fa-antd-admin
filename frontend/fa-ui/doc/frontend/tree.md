# Tree

```typescript jsx
import React from 'react';
import { BaseCascader, BaseCascaderProps } from '@fa/ui';
import { treeApi as api } from '@/services';
import { Demo } from '@/types';

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function TreeCascade(props: Omit<BaseCascaderProps<Demo.Tree>, 'serviceApi'>) {
  return <BaseCascader showRoot={false} serviceApi={api} {...props} />;
}

```

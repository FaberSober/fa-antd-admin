# Tree

## BaseTree
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

### inform
通知BaseTree更新数据
```typescript jsx
import {dispatch} from 'use-bus'

dispatch({ type: Fa.Constant.TREE_REFRESH_BUS_KEY })
```

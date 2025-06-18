
# URL
## 获取URL中query参数

## [id].tsx类型URL
URL格式为：http://xxx/path/111

```typescript jsx
import React from 'react';
import {useParams} from "react-router-dom";

export default function Page() {
  const { id } = useParams()

  return (
    <div>{id}</div>
  )
}
```

## URL中的query参数
URL格式为：http://xxx/path/111?id=222

使用组件：[qs](https://github.com/ljharb/qs)

封装过后的hooks：frontend/fa-ui/packages/ui/src/hooks/useQs.ts

```typescript jsx
import {useQs} from "@fa/ui";

const search = useQs();
// search={id:'222'}
```

## 操作标签页

```typescript jsx
import React, { useContext } from 'react';
import { MenuLayoutContext } from "@features/fa-admin-pages/layout";

const {addTab, removeTab} = useContext(MenuLayoutContext)

function handleAddTabIframe() {
  addTab({
    key: 'baidu',
    path: 'https://cn.bing.com/',
    name: 'bing',
    type: 'iframe', // iframe, inner-内部网页
    closeable: true,
  })
}

function handleAddTabInner() {
  addTab({
    key: '/admin/system/account/base',
    path: '/admin/system/account/base',
    name: '个人中心tab',
    type: 'inner', // iframe, inner-内部网页
    closeable: true,
  })
}

function handleCloseTabIframe() {
  removeTab('baidu')
}

function handleCloseTabInner() {
  removeTab('/admin/system/account/base')
}
```

## helmet

```typescript jsx
import { Helmet } from 'react-helmet-async';

<Helmet title={`title${systemConfig.title}`} />
```



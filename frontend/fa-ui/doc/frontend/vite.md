# vite常见问题记录

## Could not Fast Refresh consistent-components-exports
问题
```
hmr invalidate /src/app.tsx Could not Fast Refresh. Learn more at https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react#consistent-components-exports
```

解决
1. index.txt需要指定export的组件名称，用index

NOT OK
```typescript jsx
import React from 'react';

/**
 * @author xu.pengfei
 * @date
 */
export default function index() {
  return (
    <div>Hello1</div>
  )
}
```

OK
```typescript jsx
import React from 'react';

/**
 * @author xu.pengfei
 * @date
 */
export default function RagAi() {
  return (
    <div>Hello1</div>
  )
}
```

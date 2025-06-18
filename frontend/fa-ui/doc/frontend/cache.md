# 缓存页面状态

> 目前使用该组建，会导致上下文context失效

## react-activation
使用组建：https://github.com/CJY0208/react-activation

1. frontend/apps/admin/src/app.tsx
```typescript jsx
import { Suspense } from 'react';
import ReactDOM from "react-dom";
import { AliveScope } from 'react-activation'

// ...

// 使用AliveScope，github建议使用ReactDOM.render
ReactDOM.render(
  <AliveScope>
    <Router>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Router>
  </AliveScope>,
  document.getElementById('root')
)

```

2. 需要缓存的组建
```typescript jsx
import KeepAlive from 'react-activation'

export default () => (
  <KeepAlive name="/logLogin" saveScrollPosition="screen">
    <MyList />
  </KeepAlive>
)
```

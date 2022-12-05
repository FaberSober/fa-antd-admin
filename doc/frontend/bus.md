# BUS事件总线
> 使用组件[`use-bus`](https://github.com/fabienjuif/use-bus)

有的时候写Context传递比较麻烦的情况，可以使用bus事件总线来实现组件间的事件传输。

## 示例代码
### 接受端
```typescript jsx
import useBus from "use-bus";

useBus(
  ['@@api/CHANGE_URL_LOADING'],
  ({ type, payload }) => {
    console.log('callback', type, payload)
  },
  [],
)
```

### 发送端
```typescript jsx
import {dispatch} from 'use-bus'

dispatch({ type: '@@api/CHANGE_URL_LOADING', payload: { url: 'http://xxx/123', loading: true } })
```


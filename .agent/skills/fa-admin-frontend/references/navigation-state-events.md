# 导航、页面状态与通信

归并自 `route.md`、`url.md`、`home.md`、`login.md`、`cache.md`、`bus.md` 和 `socket.md`。

## 目录

- 路由与参数
- 菜单标签页
- 页面标题
- 首页 Cube
- 登录页效果
- 页面缓存
- 事件总线
- WebSocket/Socket.IO

## 路由与参数

页面跳转使用 React Router：

```tsx
const navigate = useNavigate();
navigate('/admin/system/base/alert');
```

动态路径使用 `useParams()`，Key 按路由定义处理，并考虑 `undefined`：

```tsx
const { id } = useParams<{ id: string }>();
```

query 参数使用 `@fa/ui` 的 `useQs()`，不要在多个页面重复解析 `window.location.search`。`useQs` 当前基于 `qs`，返回值可能是字符串、数组或嵌套对象；使用前做类型收窄和默认值处理。

## 菜单标签页

后台菜单标签通过 `MenuLayoutContext` 操作：

```tsx
const { addTab, removeTab, reloadTab } = useContext(MenuLayoutContext);

addTab({
  key: '/admin/system/account/base',
  path: '/admin/system/account/base',
  name: '个人中心',
  type: 'inner',
  closeable: true,
});
```

- `key` 在打开标签中唯一且稳定，通常与内部路由一致。
- `type` 只能使用当前类型允许的 `inner`/`iframe`。
- 外部 iframe URL、权限、可信域和安全策略必须明确。
- 关闭、选择、刷新使用 context 当前方法，不直接修改 DOM 或浏览器历史模拟标签状态。
- Office 标签页规则见 [files-rich-components.md](files-rich-components.md)。

## 页面标题

页面需要更新 document title 时使用现有 `react-helmet-async` Provider 下的 `Helmet`：

```tsx
<Helmet title={`页面标题-${systemConfig.title}`} />
```

避免组件间互相覆盖标题；跟随目标路由相邻页面写法。

## 首页 Cube

首页统计/内容 Cube 导出大写命名组件，并按当前首页加载器需要设置静态元数据：

```tsx
export function CountUser() {
  return <div>...</div>;
}

CountUser.displayName = 'CountUser';
CountUser.title = '用户量';
CountUser.description = '总用户量';
CountUser.showTitle = false;
CountUser.permission = '';
CountUser.w = 6;
CountUser.h = 4;
```

`displayName` 与函数名一致；权限对应当前菜单 link URL。宽度网格最大值和高度单位以首页布局当前实现为准。优先参考 `fa-admin-pages/cubes/homecubes`，不要只复制历史简单示例。

## 登录页效果

Vanta/Three/p5 等背景效果属于可选视觉增强。新增前确认现有登录页结构、包体积、移动端/低性能设备降级、暗色主题和清理生命周期。不要仅为背景同时引入多个大型依赖；动态加载并提供静态 fallback。

## 页面缓存

历史 `react-activation` 方案已记录会导致 Context 失效，且旧示例依赖 `ReactDOM.render`。不要直接恢复该做法。需要保持列表状态时优先：

- 使用菜单标签的当前保活/重载机制。
- 将查询条件放入 URL、现有 store 或受控父层。
- 保留必要局部状态而不是缓存整个 React 子树。

只有确认与当前 React/Vite/Context 兼容并有真实需求时才引入缓存库。

## 事件总线

跨层级、松耦合的全局事件可以复用 `use-bus`；直接父子或明确共享状态优先 props/context/store。

```tsx
useBus(['@@biz/ITEM_CHANGED'], ({ payload }) => refresh(payload), [refresh]);
dispatch({ type: '@@biz/ITEM_CHANGED', payload: { id } });
```

- 优先复用现有事件常量，如树刷新使用 `Fa.Constant.TREE_REFRESH_BUS_KEY`。
- 事件名包含业务命名空间，payload 有稳定类型。
- 依赖数组包含回调读取的最新值，避免闭包陈旧。
- 不用 bus 构造难以追踪的请求/响应流程。

## WebSocket/Socket.IO

项目 WebSocket 已由 `fa-admin-pages/layout/websocket` 管理连接、心跳、Zustand handler 和 bus 分发。业务代码使用现有 `sendMessage`，不要自行新建第二条连接：

```tsx
sendMessage({ type: 'WebSocketTaskDemo', data: { taskId } });

useBus(
  ['@@ws/RECEIVE/WebSocketTaskDemo'],
  ({ payload }) => {
    if (payload.taskId === taskId) onTaskChange(payload);
  },
  [taskId],
);
```

消息 `type` 必须与后端协议和 `@@ws/RECEIVE/${type}` 订阅一致；按 task/user/business ID 过滤消息。组件卸载时停止业务订阅/任务，敏感数据不进入日志。

Socket.IO 是另一套协议，只有目标模块已使用 `useSocketIO` 或服务端明确要求时才用；不要与原生 WebSocket API 混用。

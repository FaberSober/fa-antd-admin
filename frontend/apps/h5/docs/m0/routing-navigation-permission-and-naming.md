# H5 路由、导航、权限与命名规范

## 状态

Frozen for M1，2026-07-22。

## 1. URL 与路由

### 1.1 基路径

- 外部发布基路径：`/h5/`。
- React Router basename：`/h5`。
- Manifest 中的内部 path 不包含 basename，例如 `/app/messages`。
- 后端 `scope=2` 菜单的 `linkUrl` 使用完整发布路径，例如 `/h5/app/messages`。

### 1.2 路由分区

| 分区 | 访问条件 | 示例 |
|---|---|---|
| 公开页面 | 无登录要求 | `/login`、`/auth/callback` |
| 登录后平台页面 | 登录即可访问 | `/app/home`、`/app/me` |
| 登录后业务页面 | 登录 + permission | `/app/messages`、`/app/vision/projects` |
| 异常页面 | 按异常类型 | `/403`、`/404` |

首期路由基线：

```text
/                         -> 根据会话进入 /app/home 或 /login
/login                    -> 账号密码登录
/auth/callback            -> 预留，MVP 不启用 SSO code 交换
/app/home                 -> 工作台
/app/messages             -> 个人消息中心
/app/me                   -> 个人中心
/403                      -> 无权限
/*                        -> H5 404
```

### 1.3 path 命名

- 静态 path segment 使用小写 kebab-case。
- 动态参数使用业务语义 camelCase，例如 `:messageId`、`:projectId`。
- 列表使用名词复数，例如 `/projects`。
- 详情使用 `/:projectId`，编辑使用 `/:projectId/edit`。
- 不在 URL 中使用 `index`、组件名、数据库表名或技术缩写。
- path 不以 `/` 结尾，根路由除外。
- query 参数使用 camelCase，并在页面入口统一解析和收窄。

## 2. route ID

- 格式：`<feature-id>.<semantic-name>`。
- 示例：`fa-h5-base-pages.messages`、`fa-vision-h5-pages.project-detail`。
- route ID 一旦用于项目预设、导航或权限映射，不应随文件移动而改变。
- 不使用数组下标或随机 ID。

## 3. 导航

### 3.1 底部导航

- 只承载 3～5 个一级高频入口。
- 导航项引用 route ID，不重复保存 path 和 permission。
- 默认候选：工作台、消息、业务主入口、我的。
- 详情、表单和设置页面不进入底部导航。
- 切换底部导航保留各入口合理的 Query Cache；不缓存整棵 React 子树。

### 3.2 首页入口

- Feature 可贡献首页入口，但必须引用已注册 route ID。
- 首页按 permission 过滤后再排序。
- 首页入口只表达导航，不在 Manifest 中执行请求。

### 3.3 外部链接

- 默认不允许 Feature 直接贡献任意外部 URL。
- 确需外链时使用独立类型并配置协议、可信域、打开方式和安全属性。
- 禁止用外链绕过 H5 权限守卫。

## 4. 权限模型

权限判断顺序：

```text
Feature 是否被项目启用
  -> route 是否已注册
  -> 是否存在有效登录会话
  -> scope=2 菜单是否包含 route.permission
  -> 页面渲染
  -> 后端对每次 API 请求做最终鉴权和数据范围校验
```

### 4.1 菜单范围

- H5 调用 `GET /api/base/rbac/rbacUserRole/getMyMenus?scope=2`。
- `scope=1` 是 Admin/Web 菜单，H5 不使用。
- H5 菜单和按钮权限数据必须设置 `scope=2`。
- Feature route permission 与 `RbacMenu.linkUrl` 精确匹配。

### 4.2 平台 allowlist

以下页面可以只要求登录，不依赖业务菜单：

- `/app/home`
- `/app/me`
- `/403`

allowlist 由平台代码集中维护，Feature 不能自行扩大。

### 4.3 业务页面

- 业务路由必须声明 permission。
- 无权限直接访问进入 `/403`，不能伪装成 404。
- 导航隐藏、路由拦截和操作按钮使用同一权限集合。
- 前端权限只改善体验，不能替代后端鉴权。

### 4.4 按钮权限

- 首期仅当后端已有独立按钮权限时才映射按钮 permission。
- 个人消息中心的已读操作随消息中心页面权限开放，后端按当前用户限制数据范围。
- 删除操作不进入消息中心试点。

## 5. Feature 与文件命名

| 对象 | 规范 | 示例 |
|---|---|---|
| Feature 目录 | `fa-<domain>-h5-pages` | `fa-vision-h5-pages` |
| Feature ID | 与目录名完全一致 | `fa-h5-base-pages` |
| 页面组件 | PascalCase + `Page` | `MessageListPage` |
| 普通组件 | PascalCase | `MessageCard` |
| Hook | `use` + PascalCase | `useMessageList` |
| Service 文件 | camelCase 资源名 | `message.ts` |
| Service 实例 | camelCase + `Api` | `messageApi` |
| Type 文件 | PascalCase 业务域 | `Message.ts` |
| Query Key | Feature ID + 资源 + 参数 | `['fa-h5-base-pages', 'messages', params]` |
| CSS 变量 | `--fa-h5-*` | `--fa-h5-page-bg` |

`index.tsx` 可以作为路由文件名，但默认组件函数必须使用业务名称，不能命名为 `index`。

## 6. Feature 边界

允许：

- Feature 引用自身 `services`、`types`、`queries`、`components`。
- Feature 引用 H5 platform/shared 公共出口。
- Feature 引用 `dependsOn` 中 Feature 的 `index.ts` 公共出口。

禁止：

- `@/services` 或 `@/types` 聚合所有业务模块。
- 跨 Feature 深层相对路径。
- Feature 引用 `src/projects/*`。
- 页面直接拼后端完整 URL。
- 在 Manifest 顶层执行请求、读取 Token 或注册全局监听。
- 通过事件总线模拟同步请求/响应。

## 7. 页面状态与返回

- 需要恢复的筛选条件进入 URL search params。
- 列表数据和分页由服务端状态层管理。
- `restoreScroll` 只用于明确需要返回定位的列表页。
- 新增/编辑成功后失效相关 Query，再返回列表或详情。
- 未保存表单离开时提示用户。
- 401 回跳参数只接受 H5 内部路径。

## 8. Review Checklist

- route ID、path、permission 是否唯一且稳定。
- path 是否未包含 `/h5` basename。
- permission 是否以 `/h5/` 开头并对应 `scope=2` 菜单。
- 导航和首页入口是否引用 route ID。
- Feature 是否只通过公共出口依赖其他模块。
- 页面是否具备 loading、empty、error、forbidden 状态。
- query、动态参数和后端主键类型是否经过收窄。

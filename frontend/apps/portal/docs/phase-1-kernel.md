# Portal Phase 1 轻量内核实施报告

> 状态：实现完成，等待 M1 验收
> 日期：2026-07-23
> 对应 Roadmap：[`portal-architecture-roadmap.md`](./portal-architecture-roadmap.md)
> 对应 ADR：[`adr/0001-portal-architecture.md`](./adr/0001-portal-architecture.md)、[`adr/0002-portal-user-and-access-control.md`](./adr/0002-portal-user-and-access-control.md)、[`adr/0003-react-router-8-upgrade.md`](./adr/0003-react-router-8-upgrade.md)

## 1. 阶段结论

Portal 已从单文件 Vite CSR starter 迁移为 React Router Framework Mode 轻量应用。开发环境统一使用 `/portal/`，Root、Router、HTTP、Auth、SEO、基础 Layout、状态页、错误边界和响应式样式均已落地。

当前实现不引入 `antd`、`@ant-design/icons`、`@fa/ui`、Admin Feature、Admin 服务聚合入口或全局状态库。登录表单、真实 Portal 用户接口和业务 Feature 不属于 Phase 1，后续按 Roadmap 接入。

## 2. 已实现能力

### 2.1 Framework Mode 与路由

- 使用 `react-router@8.3.0` 和 `@react-router/dev@8.3.0`。
- 使用 `@react-router/node@8.3.0` 支撑开发服务器和构建期预渲染。
- 使用 React/React DOM 19.2.8，Node 最低版本为 22.22.0。
- React Router v8 已移除 `react-router-dom`，Portal 普通路由 API 统一从 `react-router` 导入。
- 配置 `ssr:false`、`routeDiscovery:initial`、`buildDirectory:dist`。
- Vite `base` 与 Router `basename` 均冻结为 `/portal/`。
- 首页加入首批预渲染配置。
- 提供首页、内核状态、登录占位、受保护账户页、403 和 404 路由。
- Root 提供 Hydrate Fallback、Route Error Boundary 和导航 Loading 状态。

入口文件：

- `react-router.config.ts`
- `vite.config.ts`
- `app/root.tsx`
- `app/routes.ts`

### 2.2 轻量 HTTP Kernel

`app/kernel/http` 基于原生 `fetch`，提供：

- `VITE_PORTAL_API_BASE` API 基址。
- 默认 `Authorization` Token 注入。
- Query 参数序列化和 JSON Body 编码。
- `FormData`、`Blob`、`URLSearchParams` 和流式 Body 透传。
- 默认 15 秒超时，可通过 `timeoutMs:0` 关闭，供长连接流式聊天使用。
- 调用方 `AbortSignal` 取消。
- 204、JSON 和文本响应解析。
- 统一 HTTP/Timeout Error。
- 401/403 应用事件。
- `portalFetch` 原始 `Response` 出口，供后续 `ReadableStream` 聊天使用。

### 2.3 Auth Kernel

`app/kernel/auth` 提供：

- 与现有 Admin 一致的 Local Storage Key：`Authorization`。
- 当前用户最小模型，不包含 Admin 菜单或权限上下文。
- `/api/portal/account/me` 登录态恢复接口约定。
- `AuthProvider`、`useAuth` 和 `ProtectedRoute`。
- 无 Token 时跳转 `/login?redirect=...`。
- 401 清理失效 Token，网络异常保留显式重试入口。
- `setSession` 和 `signOut`，供后续登录 Feature 使用。

Phase 1 只完成客户端内核。`/api/portal/account/me`、注册登录接口和 `admin_enabled` 后端守卫按后续业务阶段实施。

### 2.4 SEO 与 UI Kernel

- 页面级 title、description、canonical、Open Graph 和 robots 契约。
- canonical 基址读取 `VITE_PORTAL_SITE_URL`。
- 语义化 Header/Main/Footer、跳过导航链接和键盘焦点。
- 统一 Loading、Session Error、403、404 和 Root Error UI。
- favicon 和 theme-color。
- CSS Reset、Design Tokens、360px 最小宽度、移动断点和 reduced-motion。
- 页面样式使用 CSS Modules，Token/Reset/基础 body 样式保留为全局样式。

## 3. 依赖边界

浏览器运行时直接依赖：

```text
react
react-dom
react-router
```

开发和构建期依赖：

```text
@react-router/dev
@react-router/node
isbot
typescript
vite
```

Portal `package.json` 中不存在 Admin UI 或业务模块依赖。后续需要通过依赖边界检查持续保证该约束。

## 4. 验证结果

### 4.1 静态检查

以下命令通过：

```bash
pnpm --filter @fa/portal run check
pnpm exec biome check apps/portal/app apps/portal/react-router.config.ts apps/portal/vite.config.ts
git diff --check
```

`check` 会先执行 React Router typegen，再执行 TypeScript `tsc --noEmit`。

### 4.2 开发服务器与浏览器冒烟

开发地址：`http://localhost:9001/portal/`。

已验证：

- `/portal/` 首页可直接访问，title 和语义结构正确。
- 客户端导航到 `/portal/status` 正常。
- `/portal/status` 二级路由可直接访问。
- 未登录访问 `/portal/account` 会保留 redirect 并跳到 `/portal/login`。
- 未知路由显示 Portal 404 页面。
- favicon 请求正常，浏览器 Console 无 Error/Warning。
- 390 × 844 视口下 Header、导航、正文和操作按钮正常显示。

## 5. M1 待验收与后续边界

M1 评审重点：

- 确认 Root Layout、状态页和移动端基础布局可作为后续 Feature 容器。
- 确认 HTTP/Auth/SEO 公开接口命名和职责边界。
- 确认 Portal 不依赖 Admin Runtime。

本阶段按项目验证约定未执行完整生产构建。以下工作继续保留在后续里程碑：

- `dist/client`、预渲染 HTML 和 `__spa-fallback.html` 产物验证。
- Spring/Jar 深链接、`.data`、静态资源 404 和缓存验证。
- Profile/Feature Composer 与构建裁剪验证。
- 真实注册登录、`/api/portal/account/me` 和 Admin `admin_enabled` 守卫。

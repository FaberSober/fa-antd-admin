# ADR-0002：H5 鉴权、Token 存储与 SSO

## 状态

Accepted，2026-07-23。2026-07-22 的 Token/SSO 初版结论保留，本次增量冻结共享账号和管理应用准入边界。

## 已确认的现状

- 后端使用 Sa-Token，token 名称为 `Authorization`。
- 登录接口为 `POST /api/base/admin/auth/login`，请求体包含 `username`、`password`。
- 登录响应包含 `data.tokenValue`。
- 当前 Admin 将 Token 保存到同源 localStorage 的 `Authorization` key，并在请求 Header 中发送。
- 后端 Token 默认有效期为 30 天，当前没有 refresh token 接口。
- 后端允许从 `fa-tn-tenant-id` Header 解析租户，并再次验证当前用户是否属于该租户。
- 当前存在 `loginByToken` 和 URL `token` 参数的历史用法，但传入的是可长期使用的 API Token，不是一次性授权码。
- Admin 登录已经在 `AuthBiz.requireAdminAccess` 中校验 `admin_enabled`。
- 用户拦截器已经对非 `/api/portal/**` 的受保护请求校验 `admin_enabled`；Portal API 使用独立命名空间。
- Portal 登录/注册不要求 `admin_enabled`，因此 Portal 普通用户与 Admin/H5 管理资格是同一账号上的两层能力。

## 决策

### 1. MVP 登录方式

- MVP 支持账号密码登录。
- H5 复用 Admin 登录接口和 `base_user`，不新增 H5 登录、注册或用户映射体系。
- 账号必须有效且 `admin_enabled = 1`；业务访问还需要满足租户、RBAC 和数据范围权限。
- H5 与 Admin 继续使用相同的 `Authorization` localStorage key，以兼容同源会话。
- Token 的读、写和清除只能通过 `TokenStore` 适配器，Feature 禁止直接访问 Web Storage。
- 请求层把 Token 放入 `Authorization` Header。
- 退出或 401 时清理 Token、当前租户和所有用户级 Query Cache。

选择 localStorage 是对现有单 Token、无刷新接口契约的兼容决策，不代表长期安全终态。未来改为短期 access token + HttpOnly refresh cookie 时，需要后端契约和独立 ADR。

### 2. 同源会话行为

- 用户在 Admin 登录后打开 H5，可以复用同源 Token。
- 用户从任一应用调用后端 logout 后，该 Token 在服务端失效。
- H5 logout 同时清理浏览器中的共享 `Authorization` key，因此 Admin 页面下一次请求也会进入未登录状态。
- 产品文案应明确这是同一账户会话，而不是两个互相独立的登录态。
- `admin_enabled` 被关闭后，已有 Token 的下一次 Admin/H5 管理请求必须由后端拒绝；不能只在登录时检查。
- Portal 普通用户持有的 Token 不能绕过 `admin_enabled` 调用 H5 管理 API。

### 3. SSO 和 Token 链接

- 新 H5 不实现 `?token=<长期Token>` 登录。
- `/auth/callback` 只为未来一次性 code 交换预留，不在 MVP 中启用。
- 如果业务必须接入外部 SSO，后端必须提供一次性、短时、单次消费的 code 交换接口。
- code 交换完成后通过 `history.replaceState` 或 Router replace 清理地址栏。
- 历史 `/h5/in?token=...` 仅列入迁移清单，不复制旧实现。

### 4. 登录后启动顺序

```text
读取 Token
  -> 无 Token：进入 /login
  -> 有 Token：GET getLoginUser
      -> 401：清理会话并进入 /login?redirect=...
      -> 403/未开通管理权限：保留可解释错误并进入 /403，不加载管理导航
      -> 成功：并行读取角色、scope=2 菜单、租户和未读消息数
          -> 解析当前租户
          -> 建立权限集合
          -> 进入原目标路由或 /app/home
```

### 5. 租户策略

- Header 名固定为 `fa-tn-tenant-id`。
- 如果服务端未启用租户，不发送该 Header。
- 如果启用租户，优先使用本地保存且仍在 `myTenants` 返回值中的租户；否则使用列表第一项。
- 租户切换后清除租户相关 Query Cache，重新加载用户权限和页面数据。
- Feature 不得自行拼装租户 Header。

### 6. 401、403 和跳转

- 401：清理会话，进入 `/login`，只保存同源 H5 内部 redirect。
- 403：保留会话，进入 `/403`。
- 后端 logout 返回的 URL 只有通过同源或显式 allowlist 校验后才能跳转；否则进入 `/login`。
- redirect 必须以 H5 内部路径开始，禁止 `//host`、协议 URL 和编码后的外部跳转。

### 7. 客户端标识

- H5 首期发送 `FaFrom: FaWeb`，因为它是浏览器应用。
- `FaVersionCode`、`FaVersionName` 从允许公开的 `VITE_APP_*` 环境变量读取。
- 不记录 Token、密码、API Token、SSO code 或完整敏感请求体。

## 安全约束

- 所有动态 HTML 按不可信内容处理。
- Feature 不能读取或记录 Token。
- URL query 不承载长期凭证。
- 生产环境必须使用 HTTPS。
- H5 新增第三方脚本前需要评估 XSS 和供应链风险。
- 后端继续作为最终鉴权和数据范围边界。
- `/api/h5/**` 和复用的 Admin 业务 API 都属于管理接口，不得因为前端入口不同而跳过 `admin_enabled`。

## 后续演进条件

满足任一条件时重新评审：

- 后端提供 refresh token 或 HttpOnly Cookie。
- H5 与 Admin 改为不同域名。
- 需要企业 SSO、OAuth2/OIDC 或原生 App WebView 登录。
- 需要一个浏览器同时保持 Admin/H5 不同账户。
- 产品要求 H5 可访问但 Admin 不可访问，或要求 H5 独立用户体系。

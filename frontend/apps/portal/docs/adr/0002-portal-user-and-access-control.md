# ADR-0002：Portal 统一用户身份与 Admin 访问控制

> 状态：已接受
> 日期：2026-07-23
> 决策范围：Portal 用户身份、登录态、应用准入、接口边界与智能体聊天

## 1. 背景

Portal 除官网公开页面外，还需要承载智能体聊天等登录后业务页面。将聊天页面放入独立 Portal 应用，可以避免加载 Admin 的组件库、图标库、全量样式和服务聚合模块，但必须明确 Portal 用户与 Admin 用户的关系。

需要同时满足：

- 用户只维护一套账号和密码。
- Portal 自助注册用户默认可以使用 Portal，但不能进入 Admin。
- 后台管理员可以明确授予或收回 Admin 访问资格。
- Admin 的角色和接口权限继续生效。
- 不为当前两个固定应用增加不必要的用户表或应用关系表。
- Portal AI 页面保持轻量，并与 Admin CRUD 接口隔离。

## 2. 决策

### 2.1 统一使用 `base_user`

Portal 与 Admin 共用 `base_user`、密码验证逻辑和 Sa-Token 登录身份。不会新增 Portal 用户表，用户在 Portal 注册后无需再创建 Admin 账号，也不会感知两套账号体系。

不新增 `base_user_app`。当前应用范围固定为 Portal 与 Admin，单独维护用户应用关系会增加表、CRUD、缓存和一致性成本，收益不足。

### 2.2 只增加 `admin_enabled`

`base_user` 增加一个 Admin 应用准入字段：

```sql
ALTER TABLE `base_user`
ADD COLUMN `admin_enabled` tinyint(1) NOT NULL DEFAULT 0
COMMENT '是否允许访问后台管理端';
```

Java 实体使用：

```java
private Boolean adminEnabled;
```

不增加 `portal_enabled`。所有账号状态正常的 `base_user` 默认都可以访问 Portal。

| 账号状态 | `admin_enabled` | Portal | Admin |
|---|---:|---|---|
| 禁用 | 任意值 | 禁止 | 禁止 |
| 正常 | `0` | 允许 | 禁止 |
| 正常 | `1` | 允许 | 进入 RBAC 校验 |

`admin_enabled` 只表示能否进入 Admin 应用，不表示具体菜单、角色或接口权限，不能替代 RBAC。

### 2.3 用户创建与数据迁移规则

- Portal 自助注册：明确写入 `admin_enabled = 0`。
- 后台创建普通用户：默认 `admin_enabled = 0`，由管理员显式开启。
- 初始化超级管理员：明确写入 `admin_enabled = 1`。
- 版本升级：新增字段后，将升级前已经存在的后台用户迁移为 `admin_enabled = 1`。
- 后续导入、同步和批量创建用户时，不得依赖调用方隐式猜测，应明确采用普通用户默认值或由受权管理员指定。

数据库版本脚本需要兼容 MySQL 5.7。存量数据更新与字段默认值必须在同一版本迁移中完成，并在升级前后验证至少一个超级管理员仍可登录。

### 2.4 认证与登录态

Portal 和 Admin 复用底层用户认证服务，但使用应用级入口和校验策略：

- Portal 登录：校验凭证和账号状态，不要求 `admin_enabled`。
- Admin 登录：校验凭证、账号状态和 `admin_enabled = 1`。
- 同源部署时可以复用 `Authorization` Token，让已登录用户在 Portal 与 Admin 之间自然衔接。
- Portal 登录态只加载当前用户所需的轻量信息，不加载 Admin 菜单、按钮权限和全量运行配置。
- 如果未来使用不同顶级域名，另行设计基于安全 Cookie 或一次性票据的 SSO，不在域名间复制 Local Storage Token。

### 2.5 应用级守卫与接口权限

访问控制顺序：

```text
Portal API
  登录认证 -> 账号状态 -> Portal 业务授权/资源归属

Admin API
  登录认证 -> 账号状态 -> admin_enabled -> RBAC 接口权限
```

实现约束：

- Portal 新接口统一使用 `/api/portal/**`。
- 现有 Admin API 暂时保留原 URL，避免大范围破坏兼容性，但必须由 Admin 应用级守卫覆盖。
- Admin 守卫采用默认拒绝思路：Portal 注册用户除 Portal 接口和显式白名单外，不得访问其他后台业务接口。
- 免登录接口、API Key OpenAPI、健康检查和系统内部接口必须显式分类，不能仅依赖“未声明权限即放行”。
- `admin_enabled` 校验必须在后端执行，前端隐藏入口仅用于用户体验。
- 管理员关闭 `admin_enabled` 后，应立即注销该用户的 Admin 会话；如果共享 Token 无法只注销 Admin 范围，则 Admin 守卫必须在后续每次请求中读取最新资格并拒绝访问。

### 2.6 Portal 智能体聊天

智能体聊天在 Portal 中实现为独立 `fa-portal-ai-chat` Feature：

```text
frontend/apps/portal/app/features/fa-portal-ai-chat/
├── feature.ts
├── routes.ts
├── pages/
├── components/
├── services/
├── types.ts
└── styles/
```

前端约束：

- 路由级异步加载，聊天页不进入官网公开首屏 Chunk。
- 使用轻量 `fetch`/`ReadableStream` 处理流式响应。
- 不引入 `antd`、`@ant-design/icons`、`@fa/ui` 或 Admin 全量样式。
- 不导入 Admin 根级 `services`、`types` 聚合入口。
- Markdown、代码高亮等非首屏能力按需异步加载。

后端约束：

- 新增 `/api/portal/ai/**` Portal 专用 Controller，复用现有 AI Biz。
- Admin Agent CRUD Controller 继续服务后台管理，不直接作为 Portal 接口。
- Portal 对话记录使用真实 `base_user` 用户标识和姓名，不再把已登录用户记录为游客或 `anonymous`。
- 会话历史至少按 `agentId + userId` 隔离，并在详情、列表、删除和续聊时校验资源归属。
- 增加智能体可访问性、用户限流、配额和流式连接释放控制。

## 3. 被否决的方案

### 3.1 新建 Portal 用户表

否决原因：产生两套账号、密码、找回流程和用户体验；Admin 与 Portal 共享业务身份时还需要额外绑定关系。

### 3.2 新建 `base_user_app`

否决原因：目前只有两个固定应用，且 Portal 对全部正常用户默认开放。关系表只为单个 Admin 开关增加了不必要的表和维护逻辑。

当未来出现多个独立应用，或者应用资格需要有效期、审批状态、来源和应用级角色时，可以重新评估关系表。

### 3.3 增加 `portal_enabled`

否决原因：Portal 是正常账号的默认能力，该字段会制造无意义的状态组合。需要整体停用用户时继续使用账号全局状态。

### 3.4 仅依赖 Admin RBAC

否决原因：角色权限是细粒度业务授权，不能完整表达“是否允许进入 Admin 应用”；未显式声明权限的接口也可能形成越权入口。Admin 需要独立的粗粒度准入守卫。

### 3.5 Portal 直接复用 Admin AI 页面与 Controller

否决原因：会重新引入 Admin 重依赖，并把后台 CRUD 暴露面与普通用户业务接口混合，破坏性能和安全边界。

## 4. 影响

### 4.1 正向影响

- 用户只有一套账号和登录体验。
- Portal 自助注册天然可用，且默认不能访问 Admin。
- 数据模型仅增加一个布尔字段。
- Admin 应用准入和 RBAC 职责清晰。
- Portal AI 页面可以独立优化请求数、Chunk 和交互体验。

### 4.2 成本与限制

- 需要为 Admin 增加覆盖全部后台业务接口的应用级守卫。
- 需要迁移存量用户并更新所有用户创建入口。
- 共享 Token 时，关闭 Admin 资格不能简单等同于注销整个 Portal 会话。
- 未来应用数量明显增加时，布尔字段方案需要迁移为独立应用关系模型。

## 5. 实施验收

- [ ] `base_user.admin_enabled` DDL、实体、序列化和管理界面完成。
- [ ] Portal 注册用户默认值为 `0`。
- [ ] 存量后台用户和初始化管理员迁移为 `1`。
- [ ] Portal 用户可以登录 Portal，但无法调用 Admin 业务接口。
- [ ] `admin_enabled = 1` 的用户仍需通过 RBAC 才能调用具体 Admin 接口。
- [ ] 关闭 Admin 资格后，存量 Admin 请求立即或在下一次请求时被拒绝。
- [ ] Portal 当前用户接口不返回不必要的后台敏感字段。
- [ ] Portal AI Controller 与 Admin AI CRUD Controller 分离。
- [ ] 聊天历史按登录用户隔离，不再将已登录用户记录为游客。
- [ ] Portal AI Chat 构建图中不存在 Admin 重依赖。

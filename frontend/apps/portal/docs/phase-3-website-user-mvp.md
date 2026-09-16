# Portal Phase 3 官网与用户功能 MVP 实施报告

> 状态：实现完成，等待 M3 验收
> 更新日期：2026-07-23

## 1. 本阶段交付

默认 Profile 已组合 8 个独立 Feature：

| Feature | 主要交付 |
|---|---|
| `fa-portal-home` | 首页 Hero、核心能力、用户价值和 CTA |
| `fa-portal-company` | 关于我们、使命和发展历程 |
| `fa-portal-product` | 产品列表、解决方案和产品详情 |
| `fa-portal-content` | 案例、新闻和内容详情 |
| `fa-portal-contact` | 联系信息、咨询表单和地图占位 |
| `fa-portal-auth` | 注册、登录、退出和安全跳转 |
| `fa-portal-account` | 最小用户身份与应用准入状态 |
| `fa-portal-ai-chat` | 智能体详情、流式对话、停止/重试和用户会话历史 |

公开页面均声明 title、description、canonical/Open Graph 元数据。动态内容路径由 Feature 提供 `prerenderPaths`，React Router 配置直接使用当前 Profile 的组合结果；完整生产预渲染与性能预算仍属于 Phase 4。

公共布局已增加桌面/移动端 Header、折叠菜单、Footer、导航进度、面包屑和响应式规则。静态资源约束见 [`portal-assets.md`](./portal-assets.md)。

## 2. Portal API

Portal 客户端只调用 `/api/portal/**`：

| 方法 | 路径 | 登录 | 说明 |
|---|---|---:|---|
| POST | `/api/portal/auth/login` | 否 | 使用统一 `base_user` 登录，不要求 Admin 准入 |
| POST | `/api/portal/auth/register` | 否 | 自助注册并自动登录，`admin_enabled = 0` |
| GET | `/api/portal/auth/logout` | 是 | 注销当前统一会话 |
| GET | `/api/portal/account/me` | 是 | 返回 Portal 所需的最小用户字段 |
| POST | `/api/portal/contact/inquiries` | 否 | 提交官网咨询，包含校验和每 IP 限流 |
| GET | `/api/portal/ai/agents/{accessToken}` | 是 | 获取已发布且允许公开访问的智能体安全视图 |
| POST | `/api/portal/ai/agents/{accessToken}/chat` | 是 | 流式运行发布快照 |
| GET/POST/DELETE | `/api/portal/ai/agents/{accessToken}/conversations/**` | 是 | 仅访问当前用户自己的会话 |

Portal 返回对象不包含密码、API Token、角色菜单、工作流配置或模型密钥。AI 页面不导入 `antd`、`@fa/ui`、Admin 服务或 Admin 样式。

## 3. 统一账号与 Admin 准入

本阶段按 ADR 0002 落实统一账号模型：

- 不增加 Portal 用户表，也不增加 `base_user_app`。
- `base_user` 增加非空字段 `admin_enabled`，默认值为 `0`。
- Portal 自助注册和后台普通新增用户均默认没有 Admin 准入。
- 初始化超级管理员显式写入 `admin_enabled = 1`。
- `1.0.26_base_portal_mvp_ddl.sql` 将升级前的存量有效用户迁移为 `admin_enabled = 1`，避免升级后丢失既有后台访问。
- Admin 登录入口先校验 `admin_enabled`；所有非 `/api/portal/**` 的登录态请求也实时读取数据库并校验该字段，再进入 RBAC。
- 管理员关闭某用户的 Admin 准入后，该用户未注销的 Token 在下一次 Admin 请求即被拒绝；Portal 请求仍可继续使用。
- Admin 用户列表、编辑弹窗和详情页已增加“后台访问”字段。

`admin_enabled` 只负责应用级入口，不替代角色、菜单和接口权限。

## 4. AI 会话隔离与配额

- Portal 会话写入真实 `base_user.id`，查询、更新和删除同时匹配 `agent_id + user_id`。
- 数据库唯一键调整为 `agent_id + user_id + session_id`；匿名用户统一使用空字符串身份，保持匿名会话唯一性。
- Portal 只运行发布快照，且智能体必须处于已发布、允许公开访问状态。
- 单用户默认最多 2 个并发流、20 次/分钟、200 次/日。
- 前端支持主动停止流、错误提示和“重试上一问”。

当前配额计数为单实例内存实现，适合作为 MVP 防护。多实例部署下的全局配额、计费和运营配置应在后续阶段迁移到 Redis/持久化配额服务。

## 5. 数据库版本

- Base：`fa-base/src/main/resources/sql/fa-base/1.0.26_base_portal_mvp_ddl.sql`
- AI：`fa-ai/src/main/resources/sql/fa-ai/1.0.17_ai_agent_portal_ddl.sql`

同时更新了两个模块的基线 DDL，保证全新安装具备相同结构。

## 6. 已执行验证

- `pnpm --filter @fa/portal check:profiles`
- `pnpm --filter @fa/portal check`
- `PORTAL_PROFILE=minimal pnpm --filter @fa/portal check`
- `mvn -pl fa-base,fa-ai -am -DskipTests compile`
- Playwright 桌面/390px 移动端冒烟：主页、移动导航、产品列表/详情深链接、联系表单校验、登录注册、账户与聊天未登录重定向

上述检查均通过。按照仓库约定，本阶段不执行 Portal 完整生产构建；生产预渲染、Chunk 尺寸、Spring Boot Jar 静态资源和缓存策略留到 Phase 4/Phase 5。

## 7. M3 验收关注点

- 使用真实业务内容、品牌图片、团队与资质资料替换当前演示内容。
- 联调真实数据库的注册、登录、关闭 Admin 准入和角色权限链路。
- 使用至少一个已发布智能体联调 SSE、主动中断、历史恢复和跨用户越权用例。
- 联调咨询表单的运营处理流程；当前已具备后台通用 CRUD 接口，但尚未配置专用菜单页面。
- 桌面端和移动端完成业务方视觉验收。

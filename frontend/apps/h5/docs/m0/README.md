# M0 架构冻结交付包

## 状态

| 项目 | 内容 |
|---|---|
| 里程碑 | M0 架构冻结 |
| 交付状态 | Completed |
| 基准日期 | 2026-07-23 |
| 完成日期 | 2026-07-23 |
| 下一阶段 | M1 平台骨架 Alpha（Not Started） |

M0 的技术调研、架构决策、契约、范围和验收基线已经冻结。项目于 2026-07-23 再次下达“开发：13.2 M0：架构冻结”指令，作为本轮增量基线的项目确认；M1 需要另行启动，不因 M0 完成自动进入开发。

## 交付物

| Roadmap 交付物 | 文件 | 状态 |
|---|---|---|
| 架构决策记录 ADR | [ADR-0001](adr/0001-h5-application-and-feature-architecture.md) | Accepted |
| Feature Manifest 和项目预设接口草案 | [Feature 与项目契约](feature-and-project-contract.md) | Frozen for M1 |
| 路由、导航、权限和目录命名规范 | [路由、导航、权限与命名规范](routing-navigation-permission-and-naming.md) | Frozen for M1 |
| 移动页面 A/B/C 适配清单 | [移动页面适配矩阵](mobile-page-adaptation-matrix.md) | Baseline |
| 首个真实业务试点及后端接口清单 | [个人消息中心试点](pilot-message-center.md) | Contract Verified |
| Token 存储和 SSO 方案确认 | [ADR-0002](adr/0002-auth-session-and-sso.md) | Accepted |
| 历史 `/h5/in/**` 路径迁移清单 | [历史 H5 路由迁移](legacy-h5-route-migration.md) | Baseline |
| 性能预算、模块图、代理、SPA fallback、缓存和发布口径 | [性能、构建与生产验收基线](performance-build-and-production-baseline.md) | Frozen for M1～M5 |

## P0 决策登记

| ID | 决策 | 结论 | 决策 Owner | 状态 |
|---|---|---|---|---|
| D-001 | H5 应用形态 | 独立 SPA，部署基路径固定为 `/h5/` | Frontend Owner | Accepted |
| D-002 | Feature 组合 | 显式 Manifest + 项目预设，不扫描并启用全部 Feature | Frontend Owner | Accepted |
| D-003 | 项目裁剪 | Vite 构建时将 `@project` 指向唯一预设 | Frontend Owner | Accepted |
| D-004 | 页面分包 | 路由定义显式注册，页面动态 import | Frontend Owner | Accepted |
| D-005 | 首期移动 UI | Ant Design Mobile + H5 独立主题 Token | Frontend Owner | Accepted |
| D-006 | 服务端状态 | TanStack Query；会话和租户先用 React Context | Frontend Owner | Accepted |
| D-007 | 请求层 | M1 先实现于 `src/platform/http`；出现第二个消费者后再提取 workspace 包 | Frontend Owner | Accepted |
| D-008 | 登录会话 | 兼容现有 `Authorization` localStorage/header 契约，访问集中封装 | Frontend/Backend Owner | Accepted |
| D-009 | SSO | MVP 不实现 URL 长期 Token 登录；一次性 code 交换另立后端任务 | Product/Backend Owner | Accepted |
| D-010 | H5 权限数据 | 调用 `getMyMenus?scope=2`，权限值使用发布路径 `/h5/...` | Frontend/Backend Owner | Accepted |
| D-011 | 首个真实试点 | 个人消息中心；删除能力不进入首期 | Product Owner | Accepted |
| D-012 | 复杂页面 | 工作流编辑、视觉标注、3D、大表格和系统监控首期保留桌面端 | Product Owner | Accepted |
| D-013 | 账号与应用边界 | 复用 `base_user`；H5 是管理入口，必须满足 `admin_enabled + RBAC`，不提供公开注册 | Product/Backend Owner | Accepted |
| D-014 | 渲染与路由 | React Router Data Mode + CSR；`basename="/h5"`；登录页不加载业务页面 | Frontend Owner | Accepted |
| D-015 | API 与开发代理 | 浏览器统一请求同源 `/api`；Vite 通过 `loadEnv()` 读取代理目标并执行 JSON 冒烟 | Frontend/Operations Owner | Accepted |
| D-016 | 性能与产物证据 | 使用目标值/硬上限双门槛；生成模块图和 `build-report.json` | Frontend/QA Owner | Accepted |
| D-017 | 生产 fallback 与缓存 | 页面深链接、静态资源和 API 分流；HTML 短缓存、hash 资源 immutable | Frontend/Operations Owner | Accepted |
| D-018 | Feature 生命周期 | 支持 `active/deprecated`；Project 对 deprecated Feature 显式记录迁移确认 | Frontend/Product Owner | Accepted |
| D-019 | 共享包提取 | 请求层先留在 H5；至少两个独立消费方且 API 稳定后才评审抽包 | Frontend Owner | Accepted |

## 已确认的后端基础

- 登录：`POST /api/base/admin/auth/login`。
- 退出：`GET /api/base/admin/auth/logout`。
- 当前用户：`GET /api/base/admin/user/getLoginUser`。
- 当前用户角色：`GET /api/base/rbac/rbacUserRole/getMyRoles`。
- H5/App 菜单：`GET /api/base/rbac/rbacUserRole/getMyMenus?scope=2`。
- 当前用户租户：`GET /api/base/tn/tenantUser/myTenants`。
- 个人消息列表、统计和已读操作：见 [个人消息中心试点](pilot-message-center.md)。
- Admin 登录路径已经调用 `requireAdminAccess` 校验 `admin_enabled`。
- 用户拦截器已经对非 `/api/portal/**` 的受保护请求校验 `admin_enabled`，关闭资格后下一次管理请求会失败。

以上结论来自 2026-07-23 的仓库源码核验，不等同于 M3/M4 的运行时集成测试。

## 已知后续任务

以下是已经明确范围和 Owner 的后续实现，不是未决架构问题：

| 任务 | 最迟阶段 | Owner |
|---|---|---|
| 为 H5 基础页面和消息中心增加 `scope=2` 的 RBAC 菜单/权限数据 | M3 | Backend Owner |
| 将 H5 消息 ID 类型按后端 `Long` 定义为 `number` | M4 | Frontend Owner |
| 将 H5 `readAll` 返回类型定义为 `Ret<boolean>` | M4 | Frontend Owner |
| 若业务必须支持外部 SSO，新增一次性 code 交换接口 | 独立立项 | Backend Owner |
| 调研外部系统是否仍生成 `/h5/in?token=...` 链接 | M1 前 | Product/Operations Owner |
| 将 H5 开发和生产 base 统一为 `/h5/`，并用 `loadEnv()` 修正开发代理 | M1 | Frontend Owner |
| 测量空壳、登录页和 App Shell，校准 provisional 性能预算 | M1～M2 | Frontend/QA Owner |
| 生成客户端模块图和 `build-report.json` 并纳入项目构建矩阵 | M2～M5 | Frontend Owner |

## M0 退出检查

- [x] P0 技术决策有明确结论和角色 Owner。
- [x] 首个试点的现有接口、类型差异和后续依赖已经确认。
- [x] M1 所需的 Feature、项目、路由、权限和鉴权契约已冻结。
- [x] H5 已确认为 Admin 移动管理入口，不提供 Portal 式公开注册。
- [x] `/h5/`、`/api`、开发代理、JAR 目录和静态资源分流口径已冻结。
- [x] provisional 性能预算、目标移动视口/网络和产物门禁已冻结。
- [x] Product、前端、后端和 QA 的 M1～M5 责任边界已登记。

## 评审记录

| 评审面 | 结论 | 依据/日期 | 备注 |
|---|---|---|---|
| 产品范围 | Approved | 项目开发指令 / 2026-07-23 | H5 定位、MVP 边界和消息中心试点冻结 |
| 前端架构 | Approved | M0 文档与仓库配置复核 / 2026-07-23 | Feature、Project、路由、鉴权和工程边界可进入实现 |
| 后端契约 | Verified | 后端 Controller/Biz/Interceptor 源码核验 / 2026-07-23 | 现有接口与 `admin_enabled` 边界已核验；`scope=2` 数据仍是 M3 任务 |
| QA 基线 | Approved for Planning | M0 验收基线 / 2026-07-23 | 实际性能、集成和生产验收分别在 M1～M5 执行 |

## 完成记录

- M0 于 2026-07-23 完成，Roadmap 状态同步为 `Completed`。
- 本轮增量冻结了共享账号与 `admin_enabled + RBAC` 边界、CSR 路由、开发代理、性能预算、产物证据、SPA fallback、缓存发布和 Feature 生命周期。
- 后端接口结论来自静态源码核验；未在 M0 启动后端、执行集成测试或生产部署验收。
- M0 没有实现 H5 平台代码，也没有提前创建 M1 目录；相关实现继续按 Roadmap 的 M1～M5 推进。
- M1 保持 `Not Started`，等待明确的阶段启动指令。

# Portal 官网架构设计与实施 Roadmap

> 状态：Phase 3 官网与用户功能 MVP 已实现，等待 M3 验收；M0-M2 评审项仍待确认
> 创建日期：2026-07-22
> 更新日期：2026-07-23
> 目标模块：`frontend/apps/portal`
> 建议负责人：待定

## 1. 背景与目标

`frontend/apps/portal` 用于承载官网、产品展示、解决方案、案例、新闻和联系我们等公开页面，也承载智能体聊天等面向普通用户的轻量业务页面。Portal 需要与 Admin 保持运行时隔离，避免引入 Admin 中大量后台组件和业务依赖，保证独立构建、快速加载和灵活发布。

本次建设同时需要解决业务模块组合问题：不同业务域应位于独立 Feature 目录，不同项目可以通过配置选择需要的 Feature；未选择的 Feature 不应进入最终构建产物。

核心目标：

1. 建设独立、轻量的 Portal 应用内核。
2. 形成“Feature 目录隔离 + 项目 Profile 选择 + 路由级拆包”的模块体系。
3. 保持 `/portal/` 静态部署以及随 `fa-admin.jar` 发布的现有能力。
4. 对公开内容页面进行构建期预渲染，兼顾首屏性能和 SEO。
5. 建立性能预算、模块边界、质量门禁和阶段性推进机制。
6. 复用 `base_user` 统一身份，在不引入第二套账号的前提下隔离 Portal 与 Admin 的应用访问权限。

## 2. 当前基线

### 2.1 已具备能力

- Portal 已升级到 React 19.2.8、React Router Framework Mode 8.3.0 和 Vite 7.2.6；应用声明 Node 22.22.0+。
- `frontend/apps/portal/vite.config.ts` 与 Router basename 已统一为 `/portal/`。
- Phase 1 轻量 Kernel 和 Phase 2 Feature/Profile 静态组合已实现。
- `frontend/package.json` 已提供 `dev:portal`，Portal 已纳入 pnpm workspace 和 Turbo 任务。
- `fa-admin/pom.xml` 已将 `frontend/apps/portal/dist` 复制到 Jar 的 `static/portal`。
- `fa-admin/src/main/java/com/faber/web/SpaErrorController.java` 已支持 `/portal/**` 深链接回退。

### 2.2 Admin Feature 机制的可复用经验

Admin 使用 `frontend/apps/admin/features/*` 组织业务目录，并通过 `vite-plugin-pages` 扫描 `features/*/pages`，已经实现目录级隔离和页面懒加载。

但该方案仍存在以下限制：

- 所有 Feature 页面都会被统一扫描，不能按项目真正排除未启用模块。
- `configs`、`services`、`types` 等仍需在 Admin 入口手工聚合。
- Feature 间存在较多直接导入，没有统一的依赖声明和冲突校验。
- 目录隔离、项目组合和构建产物拆包没有形成统一契约。

Portal 应保留 Admin 的目录组织优点，同时增加显式 Feature 契约和 Profile 装配层。

## 3. 总体架构决策

采用以下架构：

```text
项目 Profile
  ├── 站点品牌、域名、导航和环境配置
  └── 显式选择 Feature
          ↓
Portal 轻量内核
  ├── Root/Layout
  ├── Router
  ├── SEO
  ├── HTTP
  ├── Error Boundary
  └── Feature Composer
          ↓
已启用 Feature
  ├── 路由级异步 Chunk
  ├── 页面内部重组件异步 Chunk
  └── 构建期预渲染页面
          ↓
Portal 静态产物
  ├── 独立部署/CDN
  └── fa-admin.jar/static/portal
```

### 3.1 技术路线

- 保留 React + Vite 技术栈。
- 锁定 React Router Framework Mode 8.3.0；普通路由 API 使用 `react-router`，不再依赖 `react-router-dom`。
- Portal 使用 React 19.2.8，并保持与 Admin React 18 浏览器运行时隔离。
- Portal 不复用 Admin 应用入口和运行时。
- 设置 `ssr: false`，不增加 Node 运行时服务。
- 首页、产品、解决方案、案例等公开页面使用构建期预渲染。
- 未预渲染页面使用 SPA fallback 和客户端数据加载。
- 初期不采用 Module Federation。

React Router Framework Mode 提供 Vite 集成、路由代码拆分和静态预渲染能力，适合当前静态资源随 Spring Boot Jar 发布的方式：

- [React Router Modes](https://reactrouter.com/start/modes)
- [React Router Pre-Rendering](https://reactrouter.com/how-to/pre-rendering)

### 3.2 暂不采用 Module Federation 的原因

- 当前目标是源码级自由组合，不要求 Feature 独立部署。
- Module Federation 会增加远程模块运行时、版本协调、React 单例和故障降级成本。
- Portal 首屏对网络请求数量和稳定性敏感。
- 当未来出现多个团队独立发布、独立版本、独立域名的明确需求时，再单独立项评估微前端。

## 4. 推荐目录结构

```text
frontend/apps/portal/
├── app/
│   ├── root.tsx
│   ├── routes.ts
│   ├── entry.client.tsx
│   │
│   ├── kernel/
│   │   ├── config/
│   │   ├── feature/
│   │   │   ├── definePortalFeature.ts
│   │   │   ├── definePortalProfile.ts
│   │   │   ├── composeFeatures.ts
│   │   │   └── types.ts
│   │   ├── http/
│   │   ├── auth/
│   │   ├── seo/
│   │   └── layouts/
│   │
│   ├── shared/
│   │   ├── ui/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── styles/
│   │
│   ├── profiles/
│   │   ├── default.ts
│   │   ├── fa-ai.ts
│   │   └── customer-a.ts
│   │
│   └── features/
│       ├── fa-portal-home/
│       │   ├── feature.ts
│       │   ├── routes.ts
│       │   ├── pages/
│       │   ├── components/
│       │   ├── assets/
│       │   ├── content/
│       │   └── README.md
│       ├── fa-portal-company/
│       ├── fa-portal-product/
│       ├── fa-portal-content/
│       ├── fa-portal-contact/
│       ├── fa-portal-auth/
│       ├── fa-portal-account/
│       └── fa-portal-ai-chat/
│
├── public/
├── react-router.config.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### 4.1 目录职责

- `kernel`：所有项目都需要的最小运行内核，不放具体业务。
- `shared`：Portal 内共享的无业务语义组件和工具。
- `profiles`：不同项目的站点配置和 Feature 装配入口。
- `features`：按业务域组织页面、组件、资源、内容和接口。
- `root.tsx`：全局 HTML、布局、错误边界和基础 SEO。

`kernel/auth` 只提供登录态读取、当前用户、受保护路由和未授权处理等应用级能力；登录注册页面属于 `fa-portal-auth`，个人中心属于 `fa-portal-account`。`fa-portal-ai-chat` 只依赖 Portal Kernel、Shared 和自身代码，不得导入 Admin 页面、Admin 服务聚合入口或 Admin 类型聚合入口。

Feature 应按业务域划分，不建议一页一个 Feature。Header、Footer、主题、404 和错误边界属于内核，不应复制到业务 Feature。

## 5. Feature 契约与组合机制

### 5.1 Feature 契约

每个 Feature 只暴露一个公开入口：

```ts
interface PortalFeature {
  id: string;
  dependsOn?: string[];
  routes: PortalRouteDefinition[];
  navigation?: PortalNavItem[];
  prerenderPaths?: string[];
}

interface PortalRouteDefinition {
  id: string;
  file: string;
  path?: string;
  index?: boolean;
  children?: PortalRouteDefinition[];
}
```

推荐 Feature 定义：

```ts
export default definePortalFeature({
  id: 'fa-portal-product',
  routes: productRoutes,
  navigation: productNavigation,
  prerenderPaths: ['/products', '/solutions'],
});
```

### 5.2 Profile 契约

不同项目通过 Profile 显式选择 Feature：

```ts
export default definePortalProfile({
  site: {
    name: 'FA AI',
    baseUrl: '/portal/',
  },
  features: [
    homeFeature,
    productFeature,
    contentFeature,
    contactFeature,
  ],
});
```

构建时根据独立构建变量 `PORTAL_PROFILE` 生成被忽略的 `.portal/selected-profile.ts` 静态入口，该入口只 re-export 当前 Profile。React Router 的路由配置和浏览器运行时共用此入口。Vite mode 只负责区分 development、staging、production 等运行环境：

```text
default     -> app/profiles/default.ts
fa-ai       -> app/profiles/fa-ai.ts
customer-a  -> app/profiles/customer-a.ts
```

`PORTAL_PROFILE` 不使用 `VITE_` 前缀，不能写入 `import.meta.env`。Profile 必须静态导入 Feature，生成入口也只能导入一个 Profile。没有使用 `import.meta.glob` 扫描全部 Profile 或 Feature，未选择模块不会进入当前路由图和客户端请求图。

采用生成静态入口而不是普通 Vite alias，是因为 React Router Framework Mode 会在 Vite 普通 alias 生效前加载 `app/routes.ts`。生成文件在 Vite 配置求值阶段写入，且由 `.gitignore` 排除，不作为源码提交。

### 5.3 三层分包定义

| 层级 | 目标 | 实现方式 |
|---|---|---|
| 目录隔离 | 独立维护业务代码 | 每个业务域一个 Feature 目录 |
| 构建裁剪 | 不同项目自由组合 | Profile 静态选择 Feature |
| 路由拆包 | 降低首屏资源 | 路由模块异步加载 |
| 页面内部拆包 | 隔离重组件 | 图表、地图、视频、编辑器动态导入 |

### 5.4 依赖边界

- Feature 可以依赖 `kernel`、`shared` 和自身代码。
- 禁止通过相对路径深入导入另一个 Feature。
- 跨 Feature 能力必须通过公开入口或 Kernel 契约。
- Feature ID、路由、导航 key 重复时构建失败。
- `dependsOn` 声明的 Feature 未启用时构建失败。
- 初期 Feature 保持为应用内目录，不设置独立 `package.json`。
- 只有出现跨应用或跨仓库复用需求时，才提升为 workspace package。

## 6. 路由、SEO 与内容策略

### 6.1 路由策略

- 开发和生产统一使用 `/portal/`，消除环境路径差异。
- 所有内部链接使用 Router Link 或基于 Base URL 的 URL 工具。
- 禁止在业务代码中硬编码根路径 `/assets`、`/products` 等地址。
- 静态公开路由加入预渲染列表。
- 动态或非 SEO 路由使用 SPA fallback。
- Feature 合并阶段校验重复路由和无效父子关系。

### 6.2 SEO 策略

每个公开页面应声明：

- `title`
- `description`
- canonical URL
- Open Graph 信息
- 必要的 JSON-LD 结构化数据
- 是否允许搜索引擎索引

构建阶段生成：

- `sitemap.xml`
- `robots.txt`
- 预渲染 HTML
- 路由对应的静态数据文件

### 6.3 内容和数据来源

- 稳定营销内容：优先放在 Feature 的 `content` 目录，构建期读取。
- 普通动态数据：通过 Portal 轻量 `fetch` 客户端加载。
- SEO 敏感动态内容：构建时从 CMS/API 拉取路径和内容后预渲染。
- 强实时且必须 SEO 的内容：需要另行评估运行时 SSR，当前阶段不纳入范围。

### 6.4 用户身份与应用访问边界

Portal 与 Admin 复用 `base_user`、密码验证逻辑和 Sa-Token 登录身份，不新增 Portal 用户表，也不新增 `base_user_app` 关系表。Portal 自助注册产生的用户与 Admin 用户是同一类账号，用户只感知一套账号和密码。

`base_user` 只新增 `admin_enabled` 字段，用于表示账号是否具备进入 Admin 的应用级资格；不新增 `portal_enabled`。所有状态正常的 `base_user` 默认可以访问 Portal，Portal 自助注册和普通后台创建用户的 `admin_enabled` 默认值均为 `0`，只有后台管理员明确授权后才设置为 `1`。

| 账号状态 | `admin_enabled` | Portal | Admin |
|---|---:|---|---|
| 禁用 | 任意值 | 禁止 | 禁止 |
| 正常 | `0` | 允许 | 禁止 |
| 正常 | `1` | 允许 | 允许进入权限校验，最终能力仍由 RBAC 决定 |

访问控制采用分层校验：

- Portal API：登录认证、账号状态和资源归属校验，例如聊天记录只能由所属用户访问。
- Admin API：登录认证、账号状态、`admin_enabled = 1` 和现有 RBAC 权限校验。
- `admin_enabled` 是 Admin 应用的粗粒度准入开关，不能替代角色、菜单和接口权限。
- Portal 新接口统一使用 `/api/portal/**` 前缀；现有 Admin API 暂时保持原 URL 以兼容已有客户端，但必须纳入 Admin 应用级守卫。
- 免登录接口、API Key OpenAPI 和系统内部接口必须进入显式白名单，不能因路径判断被误归类。
- 管理员关闭 `admin_enabled` 后，应立即注销该用户的 Admin 会话，或保证 Admin 守卫每次请求都能读取到最新状态。

同源部署下，Admin 与 Portal 可以复用浏览器中的 `Authorization` Token，实现同账号登录态衔接；如果未来拆分到不同顶级域名，应另行设计基于安全 Cookie 或一次性票据的 SSO，不能复制 Local Storage Token。

详细决策见 [`adr/0002-portal-user-and-access-control.md`](./adr/0002-portal-user-and-access-control.md)。

### 6.5 Portal 智能体聊天边界

智能体聊天作为 `fa-portal-ai-chat` 独立 Feature 放入 Portal，页面和接口均按需加载。该 Feature 不复用 Admin 聊天页面的重依赖入口，不引入 `antd`、`@ant-design/icons`、`@fa/ui`、Admin 全量样式以及 Admin 根级 `services`/`types` 聚合模块。

后端新增 `/api/portal/ai/**` Portal 专用 Controller，复用现有 AI Biz，不直接开放 Admin CRUD Controller。已登录对话必须记录真实 `base_user` 用户标识，并按 `agentId + userId` 隔离会话历史，同时增加智能体访问授权、限流和配额控制。

## 7. 轻量化与性能预算

### 7.1 依赖约束

- 不引入 `antd`、`@fa/ui` 或 Admin Feature。
- 普通接口请求使用原生 `fetch` 封装。
- 流式聊天使用轻量 `fetch`/`ReadableStream` 实现，不因单个页面引入 Admin 请求体系。
- 基础组件使用 React、语义化 HTML 和 CSS Modules。
- 图标优先使用单独 SVG，不整包引入图标库。
- 不默认引入全局状态库，优先使用组件状态、Context 和 URL 状态。
- 不预先照搬 Admin 的 `manualChunks`，根据实际构建分析结果再优化。

### 7.2 静态资源约束

- 图片优先使用 AVIF/WebP，并提供响应式尺寸。
- 首屏主图允许预加载，其余图片默认懒加载。
- 默认使用系统字体；品牌字体只加载 WOFF2 子集。
- CSS 全局范围只允许 reset、design tokens 和基础布局。
- Feature 样式应局部化，避免全局类名污染。

### 7.3 性能预算

| 指标 | 建议目标 | 硬门槛 |
|---|---:|---:|
| 首屏 JS gzip | <= 120 KB | <= 150 KB |
| 首屏 CSS gzip | <= 25 KB | <= 35 KB |
| 普通页面异步 Chunk gzip | <= 80 KB | <= 120 KB |
| 首屏关键图片 | <= 200 KB | <= 300 KB |
| LCP | <= 2.5 秒 | <= 3 秒 |
| INP | <= 200 ms | <= 300 ms |
| CLS | <= 0.1 | <= 0.15 |

Phase 0 应先测量真实基线，再根据官网设计复杂度确认最终门槛。

## 8. 构建与部署设计

### 8.1 构建产物

React Router Framework Mode 的中间客户端产物位于 `dist/client`，构建后由 `prepare-deployment.ts` 统一整理到 `dist/static`：

- `dist/static/portal/**`：预渲染页面、SPA fallback、hash assets、sitemap 和 favicon。
- `dist/static/robots.txt`：站点根路径 robots。
- `fa-admin/pom.xml` 只复制 `dist/static` 到 Spring 静态资源根目录。
- Portal preview、Maven/Jar 和生产验收命令使用同一目录语义。

### 8.2 SPA fallback

当 `/` 对应页面已经预渲染时，React Router 可能生成 `__spa-fallback.html` 作为非预渲染路由入口。因此需要调整 `SpaErrorController`：

- 预渲染路径优先由 Spring 静态资源处理。
- 非预渲染 Portal 页面回退到 `/portal/__spa-fallback.html`。
- 缺失的 JS、CSS、图片、字体和 `.data` 文件仍返回真实 404。
- `/portal` 继续重定向到 `/portal/`。

### 8.3 缓存策略

- 带 hash 的 `/portal/assets/**`：`Cache-Control: public, max-age=31536000, immutable`。
- HTML、sitemap 和 robots：短缓存或协商缓存。
- 网关/CDN 开启 gzip 或 Brotli。
- 发布时先上传新 hash 资源，再切换 HTML，避免短暂资源 404。

## 9. Roadmap 总览

| 阶段 | 参考周期 | 状态 | 里程碑 |
|---|---:|---|---|
| Phase 0：基线与架构确认 | 1-2 天 | 待评审 | M0 架构基线冻结 |
| Phase 1：轻量内核 | 3-5 天 | 待验收 | M1 Portal Kernel 可运行 |
| Phase 2：Feature 与 Profile | 3-5 天 | 待验收 | M2 可按项目自由组合 |
| Phase 3：官网与用户功能 MVP | 1-3 周 | 待验收 | M3 官网内容与轻量用户闭环完整 |
| Phase 4：预渲染与性能 | 3-5 天 | 待验收 | M4 达到性能和 SEO 门槛 |
| Phase 5：发布与验收 | 2-3 天 | 待验收 | M5 可生产发布 |
| Phase 6：工程化增强 | 持续 | 待验收 | M6 模块规模化复用 |

单人开发参考：基础框架和组合机制约 2 周；包含第一版完整官网、性能优化和生产验收约 4-6 周。实际时间取决于页面数量、设计稿成熟度、内容准备情况和 CMS/API 范围。

## 10. 分阶段实施计划

### Phase 0：基线与架构确认

目标：形成可量化基线，冻结关键架构决策。

任务：

- [x] 梳理官网页面、路由、导航和内容来源。
- [x] 区分静态内容、构建期内容和实时 API 内容。
- [x] 确认目标浏览器、移动端适配范围和可访问性要求。
- [x] 测量当前 Portal 构建产物和首屏指标。
- [x] 确认 React Router Framework Mode 技术 Spike。
- [x] 确认 Profile 命名、项目选择方式和环境变量规范。
- [x] 输出 ADR：渲染策略、Feature 契约、部署目录、fallback 规则。
- [x] 确认用户身份和应用访问模型：复用 `base_user`，仅增加 `admin_enabled`。
- [x] 输出 ADR：Portal/Admin 账号、登录态、API 与访问控制边界。
- [x] 确认最终性能预算。

Phase 0 交付物：

- [`phase-0-baseline.md`](./phase-0-baseline.md)
- [`adr/0001-portal-architecture.md`](./adr/0001-portal-architecture.md)
- [`adr/0002-portal-user-and-access-control.md`](./adr/0002-portal-user-and-access-control.md)

当前阶段结论：技术工作已完成，页面清单、ADR 和性能预算等待 M0 业务评审。

验收门槛：

- 页面清单、路由表和内容来源表评审通过。
- ADR 和性能预算评审通过。
- 未决技术问题有明确负责人和截止时间。

### Phase 1：轻量内核

目标：完成独立、稳定、可扩展的 Portal Kernel。

任务：

- [x] 将现有 starter 迁移到标准 Portal 应用结构。
- [x] 接入 React Router Framework Mode。
- [x] 配置 `ssr: false` 和 `/portal/` basename。
- [x] 开发 Root、基础 Layout、404、Error Boundary 和 Loading UI。
- [x] 建立 CSS reset、design tokens 和响应式断点。
- [x] 建立轻量 `fetch` 封装，支持错误、超时和取消。
- [x] 建立 `kernel/auth`，支持 Token、当前用户、受保护路由和 401/403 处理。
- [x] 实现 Portal 登录状态恢复，不加载 Admin 用户上下文和权限菜单。
- [x] 建立页面 SEO 元数据接口。
- [x] 统一开发和生产环境 `/portal/` 路径。
- [x] 增加轻量类型/语法检查命令。

Phase 1 交付物：

- [`phase-1-kernel.md`](./phase-1-kernel.md)

当前阶段结论：代码实现和开发环境冒烟已完成，状态为“待 M1 验收”。完整生产构建、预渲染产物、Spring/Jar fallback 和资源缓存验证按项目约定留到对应里程碑执行。

验收门槛：

- 首页、404 和至少一个二级深链接可直接访问和刷新。
- Portal 依赖图中不存在 `antd`、`@fa/ui` 和 Admin Feature。
- Portal 登录态恢复和受保护路由不依赖 Admin Runtime。
- 桌面端、平板和手机基础布局正常。
- 开发与生产路径行为一致。

### Phase 2：Feature 与 Profile 体系

目标：实现业务目录隔离、项目组合和构建裁剪。

任务：

- [x] 实现 `definePortalFeature`。
- [x] 实现 `definePortalProfile`。
- [x] 实现 Feature Composer。
- [x] 实现 Feature ID、依赖、路由和导航冲突校验。
- [x] 建立 `default` 和 `minimal` Profile。
- [x] 实现 `PORTAL_PROFILE` 到静态 Profile 入口的构建映射。
- [x] 将 Home 和 Company 作为首批示例 Feature。
- [x] 验证未启用 Feature 不进入 typegen 路由图和开发客户端请求图。
- [x] 验证未启用 Feature 不进入生产构建产物。
- [x] 制定跨 Feature 导入规则。
- [x] 提供 Feature README 模板。

Phase 2 交付物：

- [`phase-2-feature-profile.md`](./phase-2-feature-profile.md)
- [`templates/feature-readme-template.md`](./templates/feature-readme-template.md)

当前阶段结论：Feature/Profile 代码、契约冲突、两个 Profile 的 typegen、浏览器差异和生产客户端模块图裁剪验证均已完成，状态为“待 M2 验收”。

验收门槛：

- 修改一个 Profile 即可组合不同 Feature。
- 未启用 Feature 不生成对应 JS、CSS 和资源。
- 重复 ID、重复路由、缺失依赖能够在开发或构建阶段失败。
- 启用新 Feature 不需要修改 Kernel 内部实现。

### Phase 3：官网与用户功能 MVP

目标：交付第一版完整官网内容，并形成注册、登录、个人身份和智能体聊天的轻量用户闭环。

建议首批 Feature：

- [x] `fa-portal-home`：首页 Hero、核心能力、客户价值、CTA。
- [x] `fa-portal-company`：关于我们、团队、资质和发展历程页面结构；正式资料待业务验收替换。
- [x] `fa-portal-product`：产品、解决方案、产品详情。
- [x] `fa-portal-content`：案例、新闻、内容详情。
- [x] `fa-portal-contact`：联系方式、咨询表单和地图占位能力。
- [x] `fa-portal-auth`：注册、登录、退出和凭证错误处理。
- [x] `fa-portal-account`：当前用户基础信息和账号状态展示。
- [x] `fa-portal-ai-chat`：智能体详情、流式对话和当前用户历史记录。

公共任务：

- [x] 完成 Header、Footer、移动端导航和面包屑。
- [x] 完成响应式布局和触控交互。
- [x] 完成表单校验、提交状态、防重复提交和错误提示。
- [x] 建立图片、视频和下载资源规范。
- [x] 补齐所有页面 SEO 元数据。
- [x] 为 `base_user` 增加 `admin_enabled`，Portal 注册默认写入 `0`。
- [x] 迁移存量后台用户的 `admin_enabled = 1`，并覆盖初始化管理员数据。
- [x] 建立 Portal `/api/portal/**` Controller，不直接复用 Admin CRUD 暴露面。
- [x] 建立 Admin 应用级守卫，统一校验 `admin_enabled` 后再进入 RBAC。
- [x] 管理员关闭 Admin 资格后，使该用户已有 Admin 会话在下一次 Admin 请求立即失效。
- [x] 聊天会话关联真实 `base_user`，并校验用户数据归属、智能体访问权限、限流和配额。

Phase 3 交付物：

- [`phase-3-website-user-mvp.md`](./phase-3-website-user-mvp.md)
- [`portal-assets.md`](./portal-assets.md)

当前阶段结论：官网页面、统一账号闭环、Portal 专用 API、Admin 准入守卫和轻量智能体聊天已实现，状态为“待 M3 验收”。正式品牌内容、真实服务联调和业务视觉确认保留为 M3 验收项。

验收门槛：

- 设计稿范围内页面完整。
- 核心浏览路径在桌面端和移动端可用。
- 表单请求有成功、失败、超时和重复提交处理。
- 页面不存在明显布局位移和阻塞式重资源。
- Portal 注册用户不能访问任何 Admin 业务接口。
- 获得 Admin 资格的用户仍需通过角色和接口权限校验。
- 用户只能访问属于自己的聊天会话，流式中断和重新连接行为可控。

### Phase 4：预渲染与性能

目标：达到官网 SEO、加载性能和质量门槛。

任务：

- [x] 为稳定公开页面启用预渲染。
- [x] 为动态内容建立构建期路径获取机制。
- [x] 生成 sitemap 和 robots。
- [x] 验证 canonical、Open Graph 和结构化数据。
- [x] 优化图片格式、尺寸、加载优先级和缓存。
- [x] 检查路由 Chunk 和页面内部动态导入。
- [x] 增加 gzip 后产物大小检查。
- [x] 建立 Lighthouse 或等价性能检查基线。
- [x] 验证禁用 Feature 不会残留资源。

Phase 4 交付物：

- [`phase-4-prerender-performance.md`](./phase-4-prerender-performance.md)

当前阶段结论：默认与 minimal Profile 的生产构建、预渲染、SEO 文件、产物预算、Feature 裁剪和真实浏览器预览均已通过，状态为“待 M4 验收”。生产域名、Spring/Jar 目录映射、HTTP 分级缓存和 gzip/Brotli 网关配置继续由 Phase 5 完成。

验收门槛：

- 查看页面源代码能够看到主要官网正文和 SEO 信息。
- 达到最终确认的 JS、CSS、图片和 Web Vitals 预算。
- 预渲染页面、SPA 页面和 404 路径行为正确。

### Phase 5：发布与生产验收

目标：打通 Jar、反向代理和可选 CDN 发布链路。

任务：

- [x] 调整 Maven Portal 产物复制目录。
- [x] 调整 Spring Portal SPA fallback。
- [x] 验证缺失静态资源返回真实 404。
- [x] 配置 hash 资源和 HTML 的分级缓存。
- [x] 配置 gzip/Brotli。
- [x] 验证 CSP、第三方脚本和外部资源域名。
- [x] 验证 Portal、Admin 和公开/API Key 接口的访问控制矩阵。
- [x] 验证关闭 `admin_enabled` 后存量 Token 无法继续调用 Admin API。
- [x] 验证 Jar 直接运行和 `/portal/` 子路径，提供反向代理配置与自动验收命令。
- [x] 建立发布检查清单、回滚策略和版本记录。

Phase 5 交付物：

- [`phase-5-release-production-acceptance.md`](./phase-5-release-production-acceptance.md)
- [`portal-production-nginx.conf.example`](./portal-production-nginx.conf.example)

当前阶段结论：生产目录、Maven/Jar 装配、Spring 路由、分级缓存、gzip、安全头、访问矩阵和自动生产验收均已实现；默认 Profile 的 Maven 全链路构建与真实 Jar HTTP 验收通过，状态为“待 M5 目标环境验收”。正式 Nginx/CDN、TLS、Brotli 和蓝绿切换仍需在目标服务器按发布清单确认。

验收门槛：

- `/portal/`、预渲染路径和非预渲染深链接均可访问。
- 刷新任意有效路由不出现 404。
- 缺失资源不会错误返回 HTML。
- 新旧版本切换期间无静态资源 404。
- 具备明确、可执行的回滚方案。

### Phase 6：工程化增强

目标：降低后续新增项目和 Feature 的维护成本。

任务：

- [x] 提供 Feature 创建脚手架。
- [x] 提供 Profile 创建脚手架。
- [x] 建立 Feature 目录和依赖关系文档。
- [x] 建立典型 Profile 组合矩阵 CI。
- [x] 增加依赖边界自动检查。
- [x] 评估将稳定共享能力提升为独立 workspace package。
- [x] 建立废弃 Feature 和配置迁移机制。

Phase 6 交付物：

- [`phase-6-engineering.md`](./phase-6-engineering.md)
- [`feature-catalog.generated.md`](./feature-catalog.generated.md)
- [`feature-lifecycle.md`](./feature-lifecycle.md)
- [`ADR-0004：Portal 稳定共享能力暂不提升为 workspace package`](./adr/0004-portal-shared-package-boundary.md)

当前阶段结论：Feature/Profile 脚手架、自动目录发现、依赖边界、Profile 矩阵、目录文档防漂移、生命周期迁移协议和 GitHub Actions 生产构建矩阵均已实现；本地工程门禁、typegen、TypeScript 以及 `default`、`minimal` 两套生产构建均通过，状态为“待 M6 CI/团队流程验收”。

验收门槛：

- 新项目主要通过新增 Profile 和品牌资源完成装配。
- 新 Feature 可通过模板快速创建并自动满足基础规范。
- 典型组合能够在 CI 中持续验证。

## 11. Feature 完成定义

每个 Feature 合入前必须满足：

- [ ] 具备唯一 `id` 和明确的业务边界。
- [ ] 具备 `feature.ts`、路由、导航和 SEO 声明。
- [ ] 没有跨 Feature 深层导入。
- [ ] 页面默认按路由拆包。
- [ ] 重型能力按需动态加载。
- [ ] 桌面端和移动端均可用。
- [ ] 深链接刷新正常。
- [ ] 具备基本路由或交互冒烟验证。
- [ ] 未突破 Chunk 和图片性能预算。
- [ ] README 记录启用方式、配置、接口、依赖和限制。

## 12. 验证策略

日常开发优先采用轻量验证：

- 相关文件检查。
- TypeScript 类型和语法检查。
- 路由/Feature Composer 单元验证。
- 使用现有开发服务器进行页面和深链接验证。
- 针对目标 Profile 做局部构建图检查。

完整生产构建只在明确的里程碑、CI 或任务明确要求时执行，不作为每次前端修改的默认动作。

建议验证矩阵：

| 场景 | default | fa-ai | customer-a |
|---|---:|---:|---:|
| Feature 契约检查 | 必须 | 必须 | 必须 |
| 路由冲突检查 | 必须 | 必须 | 必须 |
| 类型检查 | 必须 | 必须 | 必须 |
| 深链接冒烟 | 必须 | 必须 | 抽样 |
| 生产构建 | 必须 | 必须 | 发布前 |
| 性能预算 | 必须 | 必须 | 发布前 |

## 13. 主要风险与应对

| 风险 | 影响 | 应对措施 |
|---|---|---|
| Profile 动态导入导致所有 Feature 入包 | 失去构建裁剪能力 | Profile 必须静态导入，并检查构建图 |
| 开发根路径与生产 `/portal/` 不一致 | 深链接和资源路径故障 | 开发、预览、生产统一 `/portal/` |
| 预渲染产物目录变化 | Maven 未复制正确产物 | 构建统一生成 `dist/static`，门禁校验后再装入 Jar |
| 首页预渲染后仍回退到 `index.html` | 动态路由 hydration 异常 | 使用正确 SPA fallback 文件 |
| Feature 交叉深层依赖 | 模块无法自由组合 | 公开入口、依赖声明和边界检查 |
| 全局 CSS 污染 | 项目组合后样式冲突 | CSS Modules 和严格全局样式白名单 |
| 内容构建后过期 | 新闻等内容不及时 | 明确构建期刷新或客户端实时加载策略 |
| 引入重量依赖 | 首屏包体持续增长 | 依赖白名单、Chunk 预算和构建门禁 |
| Portal 用户复用 `base_user` 后越权访问 Admin | 普通注册用户获得后台接口能力 | Admin 应用级默认拒绝守卫 + `admin_enabled` + RBAC |
| `admin_enabled` 只在登录时校验 | 关闭后台资格后旧 Token 仍可访问 | 踢出 Admin 会话或请求级读取最新状态 |
| Portal 直接复用 Admin AI Controller | 暴露 CRUD、权限边界混乱 | `/api/portal/ai/**` 薄 Controller + 复用 Biz |
| 聊天页面导入 Admin 聚合模块 | Portal 请求数和包体回升 | 独立 Feature、依赖边界检查和 Chunk 预算 |

## 14. 建议实施顺序

1. 完成 Phase 0，冻结技术路线和性能预算。
2. 完成 Phase 1-2，优先把 Kernel、Feature 和 Profile 机制做稳。
3. 使用 Home、Company 两个 Feature 验证架构，而不是一次迁移全部页面。
4. 架构验证通过后并行开发 Product、Content、Contact。
5. 页面范围稳定后集中处理预渲染、性能和发布链路。
6. 第一个项目正式发布后，再推进脚手架和 workspace package 抽取。

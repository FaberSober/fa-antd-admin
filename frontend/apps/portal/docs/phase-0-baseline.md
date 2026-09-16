# Portal Phase 0 基线与架构确认报告

> 状态：技术工作完成，等待 M0 业务评审
> 日期：2026-07-22
> 更新日期：2026-07-23
> 对应 Roadmap：[`portal-architecture-roadmap.md`](./portal-architecture-roadmap.md)
> 对应 ADR：[`adr/0001-portal-architecture.md`](./adr/0001-portal-architecture.md)、[`adr/0002-portal-user-and-access-control.md`](./adr/0002-portal-user-and-access-control.md)、[`adr/0003-react-router-8-upgrade.md`](./adr/0003-react-router-8-upgrade.md)

## 1. Phase 0 结论

Phase 0 已完成仓库现状、构建产物、浏览器表现、技术兼容性、页面规划、内容来源、浏览器目标、Profile 规则和性能预算的基线设计。

技术结论：

- 保留独立 React + Vite Portal。
- 使用 React Router Framework Mode v8.3.0、`ssr:false` 和构建期预渲染。
- 使用 `PORTAL_PROFILE` 静态选择 Feature，Vite mode 只表示运行环境。
- 继续使用 `/portal/` 和 Spring Boot Jar 静态发布。
- Portal 与 Admin 统一复用 `base_user`；所有正常用户默认可访问 Portal，仅使用 `admin_enabled` 控制 Admin 应用准入。
- Portal 登录后业务接口统一使用 `/api/portal/**`，Admin 采用 `admin_enabled + RBAC` 双层访问控制。
- 当前 starter 包体很小，但 HTML 没有正文，不具备正式官网 SEO 基线。
- M0 当前为“等待业务评审”；Phase 1 技术骨架可以开始，正式内容开发应等待页面和内容负责人确认。

## 2. 仓库与工具链基线

| 项目 | 当前值 | 说明 |
|---|---|---|
| Portal package | `@fa/portal@0.0.1` | 独立 workspace 应用 |
| React | 19.2.8 | Portal 直接依赖 |
| React DOM | 19.2.8 | Portal 直接依赖 |
| React Router | 8.3.0 | Framework Mode |
| Vite | 7.2.6 | Portal 构建工具 |
| TypeScript | 5.9.2 | `strict: true` |
| TypeScript target | ES2022 | 不是最终浏览器兼容范围 |
| Node | >=22.22.0 | Portal 应用运行与构建基线 |
| pnpm | 10.24.0 | 与根 `packageManager` 一致 |
| 开发端口 | 9001 | `vite --port 9001` |
| 生产 Base URL | `/portal/` | 当前仅生产模式启用 |
| 当前路由 | Kernel 路由 + Profile Feature 路由 | Phase 1、Phase 2 已实现 |
| 当前数据请求 | 无 | starter 为纯静态文案 |
| 当前 Portal env 文件 | 无 | 仅 Vite config 读取进程变量 |
| Jar 复制源 | `apps/portal/dist` | React Router 迁移后需复核 |
| SPA fallback | `/portal/index.html` | 预渲染后需区分 `__spa-fallback.html` |

### 2.1 当前已有的公共后端能力

仓库核对结果：

- `/api/base/admin/configSys/getSystemConfig` 标记为免登录，可用于非 SEO 关键的运行时系统配置。
- `/api/base/admin/smsCode/portal/create` 标记为免登录，可用于 Portal 短信验证码。
- `SysNewsController` 和 `NoticeController` 没有 Portal 专用免登录读取接口，不应直接作为官网公开内容 API。
- 当前未发现“咨询提交”“公开产品/案例/新闻列表”专用 API。

结论：品牌名、SEO、导航等关键内容应由构建期 Profile 提供；咨询、公开新闻等动态能力需要 Phase 3 另行设计公共 API，不能默认复用 Admin CRUD 接口。

### 2.2 用户与访问控制基线

仓库当前统一使用 `base_user` 和 Sa-Token `Authorization` Token。认证拦截器覆盖 `/api/**`，接口细粒度权限主要依赖显式权限声明；部分通用 CRUD Controller 没有逐接口权限声明，因此 Portal 开放自助注册前必须补充 Admin 应用级准入守卫，不能仅依赖前端菜单或是否分配角色。

已确认的目标模型：

- 不新建 Portal 用户表，避免用户面对两套账号。
- 不新建 `base_user_app`，当前只有 Portal 与 Admin 两个固定应用，不引入额外关系表。
- 不增加 `portal_enabled`；所有账号状态正常的 `base_user` 均可访问 Portal。
- `base_user` 仅新增 `admin_enabled`，默认 `0`；后台管理员明确授权后才设置为 `1`。
- Admin 请求必须同时满足账号正常、`admin_enabled = 1` 和 RBAC 权限。
- Portal 请求校验账号状态和数据归属，不加载 Admin 菜单与权限上下文。
- Portal 自助注册用户默认 `admin_enabled = 0`，不能访问任何 Admin 业务接口。
- 存量后台用户在版本迁移时设置为 `admin_enabled = 1`，避免升级后失去后台访问能力。
- 管理员关闭 Admin 资格后，已有 Admin 会话必须立即失效或在下一次请求时被守卫拒绝。

应用接口边界：Portal 新接口统一放在 `/api/portal/**`；现有 Admin URL 为兼容历史客户端暂不整体迁移，但均应纳入 Admin 应用级守卫。免登录、API Key OpenAPI 和内部调用使用显式白名单，不依赖模糊路径推断。

## 3. 当前生产构建基线

执行命令：

```bash
pnpm --filter @fa/portal run build
```

原始 starter 基线执行环境：Node 22.21.1、pnpm 10.24.0、Vite 7.2.6。该数据是升级前历史快照，不代表当前 React Router v8 的产物。

| 产物 | 原始大小 | gzip 大小 |
|---|---:|---:|
| HTML | 0.48 kB | 0.30 kB |
| CSS | 0.96 kB | 0.56 kB |
| JS | 143.26 kB | 46.27 kB |
| 合计 | 144.70 kB | 47.13 kB |

其他数据：

- 转换模块数：26。
- 本机生产构建耗时：约 416 ms。
- 当前没有图片、字体、Router、Feature、业务 API 或第三方分析脚本。

结论：当前数据是“空壳基线”，不能代表官网 MVP 的最终包体。它用于计算 Kernel 增量和发现依赖回归。

## 4. 浏览器基线

使用 Vite preview 和 Chromium/Playwright 对生产产物进行本地检查。

### 4.1 桌面首次打开

| 指标 | 结果 |
|---|---:|
| 视口 | 1280 x 720 |
| HTTP 状态 | 200 |
| HTML transfer size | 781 B |
| JS transfer size | 46,571 B |
| CSS transfer size | 1,262 B |
| DOM load | 约 69 ms |
| FCP | 约 684 ms |
| Console error | 1 个 |

Console error 为 `/favicon.ico` 返回 404。

### 4.2 移动端热加载检查

| 指标 | 结果 |
|---|---:|
| 视口 | 390 x 844 |
| FCP | 约 100 ms |
| LCP | 约 100 ms |
| CLS | 0 |
| 页面宽度 | 390 px |
| 横向溢出 | 无 |
| 可见正文长度 | 96 字符 |

注意：以上是本机无网络节流的实验数据，桌面首次打开还包含浏览器冷启动影响；它不替代后续 Lighthouse 的受控网络和 CPU 测试。

### 4.3 SEO 与语义基线

已有项：

- `html lang="zh-CN"`。
- 页面包含 `main`、`nav` 和唯一 `h1`。
- 链接具有可读文本。
- viewport 包含 `viewport-fit=cover`。

缺失项：

- 服务端返回 HTML 的 `#root` 为空，官网正文完全依赖客户端执行。
- 页面标题仅为 `Fa Portal`。
- 没有 description、canonical、Open Graph、JSON-LD。
- 没有 favicon、sitemap、robots。
- 没有跳过导航链接、焦点样式和 reduced-motion 验证。

结论：当前响应式空壳可用，但 SEO 和完整可访问性尚未达到官网要求。

## 5. 页面、路由与导航提案

以下是 M0 评审用的初始路由表。稳定公开路径默认预渲染；动态详情路径根据内容清单在构建时生成。

| Feature | 路由 | Header 导航 | 渲染策略 | 优先级 | 内容来源 |
|---|---|---|---|---|---|
| `fa-portal-home` | `/` | 首页/Logo | 预渲染 | P0 | Profile + 仓库结构化内容 |
| `fa-portal-company` | `/about` | 关于我们 | 预渲染 | P0 | 仓库结构化内容 |
| `fa-portal-product` | `/products` | 产品 | 预渲染 | P0 | 仓库内容，后续可接 CMS |
| `fa-portal-product` | `/products/:slug` | 二级入口 | 按构建期 slug 预渲染 | P0 | 仓库内容/CMS snapshot |
| `fa-portal-product` | `/solutions` | 解决方案 | 预渲染 | P0 | 仓库内容，后续可接 CMS |
| `fa-portal-product` | `/solutions/:slug` | 二级入口 | 按构建期 slug 预渲染 | P0 | 仓库内容/CMS snapshot |
| `fa-portal-content` | `/cases` | 客户案例 | 预渲染 | P1 | 仓库内容/CMS snapshot |
| `fa-portal-content` | `/cases/:slug` | 二级入口 | 按构建期 slug 预渲染 | P1 | 仓库内容/CMS snapshot |
| `fa-portal-content` | `/news` | 新闻动态 | 预渲染 | P1 | 新公共 API/CMS snapshot |
| `fa-portal-content` | `/news/:slug` | 二级入口 | 按构建期 slug 预渲染 | P1 | 新公共 API/CMS snapshot |
| `fa-portal-contact` | `/contact` | 联系我们 | 页面预渲染，表单客户端提交 | P0 | Profile + 新公共 API |
| `fa-portal-auth` | `/login`、`/register` | 用户入口 | CSR，已登录时跳转 | P0 | `/api/portal/auth/**` |
| `fa-portal-account` | `/account` | 用户菜单 | CSR，要求登录 | P0 | `/api/portal/account/**` |
| `fa-portal-ai-chat` | `/ai/agents/:agentId/chat` | 产品/智能体入口 | CSR，要求登录，路由级拆包 | P0 | `/api/portal/ai/**` |
| `fa-portal-legal` | `/privacy` | Footer | 预渲染 | P0 | 法务确认后的仓库内容 |
| `fa-portal-legal` | `/terms` | Footer | 预渲染 | P1 | 法务确认后的仓库内容 |
| Kernel | `*` | 无 | SPA/静态 404 | P0 | 内置 |

### 5.1 建议 Header 导航顺序

1. 产品
2. 解决方案
3. 客户案例
4. 新闻动态
5. 关于我们
6. 联系我们

Logo 点击返回首页；隐私政策、服务条款、备案和版权信息放在 Footer。

### 5.2 首批 Profile 提案

| Profile | 用途 | Feature 组合 |
|---|---|---|
| `default` | 最小可运行与架构示例 | home、company、contact、legal |
| `fa-ai` | FA AI 官网 | default + product + content |
| `customer-a` | 组合能力验证占位 | 由首个实际客户项目替换命名 |

`customer-a` 只作为 Roadmap 示例，不应在没有实际项目时进入正式配置。

## 6. 内容来源决策

| 内容类型 | Phase 1-3 默认来源 | 后续来源 | 刷新方式 |
|---|---|---|---|
| 品牌名、Logo、站点域名 | Profile | Profile | 重新构建 |
| Header/Footer 导航 | Feature + Profile | Feature + Profile | 重新构建 |
| 首页营销文案 | Feature `content` | CMS snapshot 可选 | 重新构建 |
| 产品/解决方案 | Feature 结构化内容 | CMS snapshot | 重新构建 |
| 案例/新闻 | 本地示例内容 | 公共内容 API/CMS snapshot | 内容发布触发构建 |
| SEO 元数据 | 路由内容 + Profile | CMS snapshot 可选 | 重新构建 |
| 系统运行配置 | Profile 为主 | `getSystemConfig` 可选 | 客户端请求 |
| 咨询表单 | 客户端状态 | 新建公共 API | 实时 |
| 短信验证码 | 现有公共接口 | 现有公共接口 | 实时 |
| 注册、登录和当前用户 | Portal 专用认证接口 | `base_user` 统一身份 | 实时 |
| 智能体详情和流式聊天 | Portal 专用 AI Controller | 复用现有 AI Biz | 实时 |
| 用户聊天历史 | 按 `agentId + userId` 查询 | 现有会话表扩展真实用户归属 | 实时 |

首版内容格式建议使用类型化 TypeScript/JSON。只有新闻长文等确有编辑需求时再引入 Markdown/MDX 构建能力，避免提前增加工具链。

## 7. 浏览器、设备与可访问性目标

### 7.1 浏览器目标

冻结 Vite build target：

```text
Chrome >= 111
Edge >= 111
Firefox >= 114
Safari >= 16.4
iOS Safari >= 16.4
Android Chrome >= 111
```

不在默认范围：

- Internet Explorer。
- 不支持原生 ESM/dynamic import 的浏览器。
- 旧 Android WebView。
- 未达到上述内核版本的 QQ/微信内置浏览器。

如果必须支持旧微信 WebView，需要单独确认 CSS target、polyfill、图片格式和真机测试矩阵。

### 7.2 响应式目标

- 最小支持宽度：360 px。
- 关键验证宽度：390、768、1024、1280、1440 px。
- 内容最大宽度由 design tokens 控制，不由 Feature 自行定义全局容器。
- 交互目标尺寸不小于 44 x 44 px。
- 支持安全区 `env(safe-area-inset-*)`。
- 支持横竖屏切换，不将 hover 作为唯一交互方式。

### 7.3 可访问性目标

关键公开页面按 WCAG 2.2 AA 目标实施：

- 语义化 landmarks 和唯一主标题。
- 全键盘可操作、可见焦点和跳过导航链接。
- 文本和交互控件满足 AA 对比度。
- 图片有合适 alt，装饰图使用空 alt。
- 表单 label、错误提示和状态变化可被辅助技术感知。
- 遵循 `prefers-reduced-motion`。
- 页面缩放到 200% 时核心内容和操作仍可用。

## 8. Profile 与环境变量规范

### 8.1 职责分离

| 配置 | 示例 | 职责 |
|---|---|---|
| `PORTAL_PROFILE` | `fa-ai` | 构建时选择项目 Feature，不暴露客户端 |
| Vite mode | `production`、`staging` | 选择运行环境和 `.env.[mode]` |
| `VITE_PORTAL_API_BASE` | `/api` | 客户端公开 API 前缀 |
| `VITE_PORTAL_SITE_URL` | `https://example.com/portal/` | canonical 和 sitemap 基址 |
| `VITE_PORTAL_ANALYTICS_ID` | 公开站点 ID | 可选分析配置 |

### 8.2 规则

- Profile 名称必须匹配 `^[a-z][a-z0-9-]*$`。
- 默认 Profile 为 `default`。
- Profile 文件缺失时构建失败，不静默回退。
- `PORTAL_PROFILE` 不写入 `import.meta.env`。
- `VITE_*` 变量必须声明 TypeScript 类型并在启动时校验。
- 任何密钥、后端 Token、Sentry auth token 都不能使用 `VITE_*`。
- `.env.*.local` 只用于本地，并保持 Git ignore。

## 9. React Router Framework Mode 技术核对

### 9.1 兼容性

| 依赖 | 选定版本/当前版本 | 结果 |
|---|---|---|
| `react-router` | 当前 8.3.0 | 要求 React/React DOM 19.2.7+、Node 22.22+ |
| `@react-router/dev` | 当前 8.3.0 | 支持 Vite 7-8、TS 5.1+/6/7 |
| React | 当前 19.2.8 | 通过 |
| Vite | 当前 7.2.6 | 通过 |
| TypeScript | 当前 5.9.2 | 通过 |
| Node | 应用声明 >=22.22.0 | 通过 |
| ESM | `type:module` | 通过 |

React Router 8.3.0 升级决策与迁移核对见 [`ADR-0003`](./adr/0003-react-router-8-upgrade.md)。

### 9.2 已确认能力

- Framework Mode 通过 Vite 插件提供路由模块和智能代码拆分。
- `ssr:false` 支持静态部署和预渲染。
- 支持 `appDirectory`、`basename`、`buildDirectory` 和 `prerender` 配置。
- 首页被预渲染时可生成独立 SPA fallback。
- 预渲染路径可以使用 build-time loader。
- 非预渲染实时数据可以使用 `clientLoader`。

### 9.3 Phase 1 验证进展

- basename 和 Vite base 同时为 `/portal/` 时的开发行为已通过；构建和预览待里程碑验证。
- `dist/client` 的最终目录结构。
- Spring 对预渲染 `.html`、`.data` 和 fallback 的处理。
- Profile 静态选择使用 `.portal/selected-profile.ts`；Phase 4 另生成 `.portal/runtime-profile.ts`，避免完整路由和内容声明进入 Root 首屏依赖图。
- `routeDiscovery: initial` 下的入口增量和路由 Chunk 行为。
- build-time loader 不访问浏览器全局对象的边界规则。

## 10. 最终性能预算

### 10.1 资源预算

| 指标 | 目标 | 硬门槛 | 当前空壳 |
|---|---:|---:|---:|
| 首屏 JS gzip | <= 120 kB | <= 150 kB | 46.27 kB |
| 首屏 CSS gzip | <= 25 kB | <= 35 kB | 0.56 kB |
| HTML gzip | <= 20 kB | <= 30 kB | 0.30 kB |
| 普通路由 Chunk gzip | <= 80 kB | <= 120 kB | 无 |
| 首屏关键图片合计 | <= 200 kB | <= 300 kB | 无 |
| 单张非首屏图片 | <= 150 kB | <= 250 kB | 无 |

首屏 JS 预算包含 React、Router、Kernel 和首屏页面代码，不包含用户交互后才加载的非首屏 Feature。

### 10.2 用户体验预算

| 指标 | 目标 | 硬门槛 |
|---|---:|---:|
| TTFB | <= 600 ms | <= 800 ms |
| FCP | <= 1.8 s | <= 2.2 s |
| LCP | <= 2.5 s | <= 3.0 s |
| INP | <= 200 ms | <= 300 ms |
| CLS | <= 0.10 | <= 0.15 |

### 10.3 质量分数目标

受控移动网络条件下：

- Lighthouse Performance >= 90。
- Accessibility >= 95。
- Best Practices >= 95。
- SEO >= 95。

实验配置和 Lighthouse 版本必须随报告记录，避免不同版本分数直接比较。

## 11. 未决事项

| 编号 | 事项 | 负责人角色 | 截止日期 | 对 Phase 1 的影响 |
|---|---|---|---|---|
| O-01 | 确认最终页面、Header 导航和 P0/P1 优先级 | 产品负责人 | 2026-07-24 | 不阻塞 Kernel，阻塞正式内容 |
| O-02 | 提供品牌 Logo、色彩、字体、官网文案和图片版权信息 | 品牌/内容负责人 | 2026-07-25 | 不阻塞 Kernel，阻塞视觉实现 |
| O-03 | 确认首个正式 Profile 名称和 Feature 组合 | 产品负责人 + 前端负责人 | 2026-07-24 | 不阻塞 default Profile |
| O-04 | 确认生产域名、canonical、备案和 CDN 路径 | 运维负责人 | 2026-07-24 | 不阻塞开发，阻塞 SEO 发布 |
| O-05 | 设计咨询提交公共 API、反垃圾和隐私保存策略 | 后端负责人 | 2026-07-25 | 不阻塞页面，阻塞表单联调 |
| O-06 | 确认是否要求支持旧微信/QQ 内置浏览器 | 产品负责人 | 2026-07-24 | 可能改变浏览器 target |
| O-07 | 确认分析、Sentry 和 Cookie consent 要求 | 运维/法务负责人 | 2026-07-25 | 不阻塞 Kernel，阻塞正式发布 |

## 12. M0 验收状态

| 验收项 | 状态 | 说明 |
|---|---|---|
| 页面清单 | 待业务评审 | 已形成路由和优先级提案 |
| 路由表 | 待业务评审 | 已形成 Feature/渲染策略映射 |
| 内容来源表 | 待业务评审 | 已区分构建期、CMS snapshot 和实时 API |
| 浏览器范围 | 待确认 | 已给出明确默认范围，等待 O-06 |
| React Router 技术核对 | 通过 | 版本和工具链兼容 |
| Profile 规范 | 通过 | 环境与项目组合已分离 |
| ADR | 部分通过 | ADR-0001 待评审；ADR-0002 已接受 |
| 用户身份模型 | 通过 | 统一 `base_user`，不新增 Portal 用户表或 `base_user_app` |
| 应用访问模型 | 通过 | Portal 默认开放；Admin 使用 `admin_enabled + RBAC` |
| 性能预算 | 待评审 | 已给出资源和体验硬门槛 |
| 未决事项 | 通过 | 已指定负责人角色和日期 |

建议结论：M0 已具备评审条件。Phase 1 可以先开展 Kernel 和路由骨架；业务 Feature 的正式内容应在 O-01、O-02 和 O-03 关闭后进入开发。

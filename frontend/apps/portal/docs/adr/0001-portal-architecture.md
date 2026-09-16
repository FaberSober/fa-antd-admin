# ADR-0001：Portal 轻量化、模块组合与渲染架构

> 状态：接受；2.2 节的 v7 版本选择已由 [`ADR-0003`](./0003-react-router-8-upgrade.md) 替代
> 日期：2026-07-22
> 决策范围：`frontend/apps/portal`

## 1. 背景

Portal 用于承载官网公开页面，需要同时满足：

- 独立于 Admin 构建和运行，避免 Admin 重依赖进入官网首屏。
- 不同业务域独立维护，并能按项目自由组合。
- 公开内容具有良好的首屏性能、SEO 和移动端体验。
- 保持 `/portal/` 子路径部署和随 `fa-admin.jar` 发布的能力。
- 在当前 React 19、Vite 7、pnpm workspace 和 Spring Boot 架构内渐进实施。

现有 Portal 是单入口 Vite CSR starter，没有路由、Feature、预渲染和内容数据层。现有 Admin 的 `features/*` 解决了目录组织和页面懒加载，但所有页面仍统一进入扫描范围，未形成项目级构建裁剪机制。

## 2. 决策

### 2.1 保留独立 React + Vite 应用

Portal 继续作为 `@fa/portal` 独立 workspace 应用，不挂载 Admin 应用，也不导入 Admin Feature、`antd` 或 `@fa/ui`。

Portal 基础 UI 使用语义化 HTML、React 和 CSS Modules。只有被实际页面需要的能力才能进入依赖清单。

### 2.2 使用 React Router Framework Mode v8

当前锁定相同版本的：

- `react-router@8.3.0`
- `@react-router/dev@8.3.0`
- `@react-router/node@8.3.0`

Framework Mode 即使配置 `ssr:false`，开发服务器和构建期预渲染仍需要 Node 适配层；默认服务入口还需要 `isbot@5.2.1`。这些依赖服务于开发/构建端，不进入 Portal 浏览器首屏依赖图。

选择依据：

- React Router Framework Mode 原生提供路由模块、类型生成、代码拆分和静态预渲染。
- v8.3.0 使用现代基线，要求 React 19.2.7+、Vite 7+、Node 22.22+ 和 ESM。
- Portal 已升级到 React 19.2.8，并在应用清单声明 Node 22.22+。
- v8 已移除兼容性 re-export 包 `react-router-dom`；Portal 统一从 `react-router` 导入普通 API。
- 不直接沿用 Admin 的 v7.7.1；Portal 独立采用 v8 当前稳定版。两个应用构建产物独立，不会在浏览器中同时加载两套 Router。

Vite 插件使用 `@react-router/dev/vite` 的 `reactRouter()`。迁移后不再单独配置 `@vitejs/plugin-react`，除非 Phase 1 验证发现仓库特有需求。

参考：

- [ADR-0003：Portal 升级 React Router 8](./0003-react-router-8-upgrade.md)
- [React Router Framework Mode](https://reactrouter.com/start/modes)
- [React Router 从 v7 升级](https://reactrouter.com/upgrading/v7)
- [React Router Config](https://reactrouter.com/api/framework-conventions/react-router.config.ts)

### 2.3 使用静态预渲染，不部署 Node SSR 服务

`react-router.config.ts` 的目标配置：

```ts
export default {
  appDirectory: 'app',
  basename: '/portal/',
  buildDirectory: 'dist',
  ssr: false,
  routeDiscovery: { mode: 'initial' },
  prerender: [
    '/',
    '/about',
    '/products',
    '/solutions',
    '/cases',
    '/news',
    '/contact',
  ],
};
```

说明：

- `ssr: false` 表示生产环境只有静态文件，不增加 Node 服务。
- 稳定公开页面使用 build-time loader 和预渲染 HTML。
- 实时数据使用 `clientLoader` 或普通客户端请求。
- 静态模式不使用 route `action`；咨询表单使用客户端提交到 Spring Boot 公共 API。
- Portal 路由规模有限，初期使用 `routeDiscovery: initial`，避免依赖运行时路由 manifest 请求；路由模块仍保持代码拆分。
- 首页在预渲染列表中时，同时保留 `__spa-fallback.html` 供非预渲染有效路由使用。

Phase 1 必须通过集成测试确认 basename 下的预渲染 URL、`.data` 文件和 fallback 行为，再冻结具体配置代码。

### 2.4 使用 Feature 契约组织业务模块

每个业务域位于独立目录，并通过唯一公开入口暴露：

```ts
interface PortalFeature {
  id: string;
  dependsOn?: string[];
  routes: PortalRoute[];
  navigation?: PortalNavItem[];
  prerenderPaths?: string[];
}
```

约束：

- Feature 可以依赖 Kernel、Shared 和自身代码。
- 禁止深层导入其他 Feature。
- 跨 Feature 能力必须通过公开入口或 Kernel 契约。
- Feature ID、路由、导航 key 重复时构建失败。
- 缺少 `dependsOn` 依赖时构建失败。
- 初期不为每个 Feature 设置 `package.json`；出现跨仓库复用需求后再提升为 workspace package。

### 2.5 使用 Profile 实现项目级构建裁剪

Profile 静态导入项目启用的 Feature：

```ts
export default definePortalProfile({
  site: portalSite,
  features: [homeFeature, productFeature, contentFeature],
});
```

构建配置使用 `PORTAL_PROFILE` 选择 Profile：

```text
PORTAL_PROFILE=default
PORTAL_PROFILE=fa-ai
PORTAL_PROFILE=customer-a
```

关键约束：

- `PORTAL_PROFILE` 是构建工具变量，不使用 `VITE_` 前缀，不进入客户端 Bundle。
- Vite mode 只表示 `development`、`test`、`staging`、`production` 等运行环境。
- 未指定 `PORTAL_PROFILE` 时使用 `default`。
- Profile 名称使用 kebab-case，并满足 `^[a-z][a-z0-9-]*$`。
- Profile 只允许静态导入 Feature，禁止通过 `import.meta.glob` 扫描所有 Feature 后再运行时筛选。
- 构建时验证 Profile 文件存在、Feature 依赖完整且路由无冲突。

Phase 2 实施确认：React Router 会在普通 Vite alias 生效前加载 `app/routes.ts`。因此使用 Vite 配置生成 `.portal/selected-profile.ts`，内容只有对当前 Profile 的静态 re-export；路由配置和客户端运行时共用该入口。生成目录加入 `.gitignore`，不会作为源码提交，也不会扫描其他 Profile。

公开客户端环境变量使用：

```text
VITE_PORTAL_API_BASE
VITE_PORTAL_SITE_URL
VITE_PORTAL_ANALYTICS_ID
```

所有 `VITE_*` 值都会进入客户端产物，禁止保存密钥、Token 或后端凭证。

参考：[Vite Env Variables and Modes](https://vite.dev/guide/env-and-mode)

### 2.6 冻结现代浏览器目标

Portal 明确设置 Vite `build.target`，不随 Vite 大版本默认值漂移：

```ts
build: {
  target: ['chrome111', 'edge111', 'firefox114', 'safari16.4', 'ios16.4'],
}
```

Android Chrome 使用 Chrome 111+ 基线。IE、旧 Android WebView、旧版 QQ/微信内置浏览器不在默认范围；如业务必须支持，需要独立兼容性评估。

参考：[Vite Build Target](https://vite.dev/config/build-options)

### 2.7 保持 Spring Boot 静态发布

React Router 设置 `buildDirectory: 'dist'` 后，客户端静态产物预计位于 `dist/client`。Phase 1/5 需要同步：

- Maven 资源复制源目录改为 Portal 的实际 client 输出目录。
- Spring 对非预渲染有效路由回退到 `/portal/__spa-fallback.html`。
- 缺失的 JS、CSS、图片、字体和 `.data` 文件保持真实 404。
- 验证 Spring 对 `.data` 文件的 Content-Type 和缓存策略。
- `/portal` 继续重定向到 `/portal/`。

### 2.8 内容按时效和 SEO 分类

- 稳定营销内容：代码仓库内的结构化内容，构建期读取并预渲染。
- SEO 敏感动态内容：构建时从 CMS/API 获取并预渲染。
- 普通实时内容：客户端请求。
- 强实时且必须 SEO：需要运行时 SSR，超出当前决策范围。

## 3. 被否决的方案

### 3.1 复用 Admin 应用或 `@fa/ui`

否决原因：会引入后台组件、主题和业务依赖，破坏 Portal 轻量化目标。

### 3.2 继续使用纯 Vite CSR + 手写 Data Router

否决原因：可以实现路由拆包，但预渲染、路由数据和类型生成需要自建工具链，长期维护成本高。

### 3.3 迁移 Astro/Next.js

否决原因：会引入第二套前端框架和部署约定。当前 React Router Framework Mode 已满足静态预渲染需求。

### 3.4 Module Federation

否决原因：当前没有 Feature 独立部署需求，远程运行时、版本协调和故障面与目标不匹配。

### 3.5 使用 Vite mode 选择 Profile

否决原因：Vite mode 已承担开发、测试、预发和生产环境选择。混用后会产生 `customer-a-staging` 等组合命名，并增加环境文件数量。

## 4. 影响

### 4.1 正向影响

- 公开页面可以输出可抓取 HTML。
- 未启用 Feature 不进入构建图。
- 已启用页面仍按路由拆包。
- Portal 不依赖 Node 运行时，保留现有 Jar/CDN 部署方式。
- 环境与项目组合相互独立。

### 4.2 成本与限制

- Phase 1 需要迁移现有 Vite 入口结构。
- 构建时会执行部分路由代码，模块顶层不能直接访问 `window` 或 `document`。
- 预渲染动态内容需要构建期可访问的数据源。
- React Router client 产物目录、`.data` 和 fallback 需要与 Spring 做集成验证。
- Portal 使用 React 19/React Router v8，Admin 使用 React 18/React Router v7；两者独立构建，不会进入同一个浏览器运行时。

## 5. 技术核对结果

| 检查项 | 结果 | 证据/结论 |
|---|---|---|
| React 兼容性 | 通过 | React Router 8.3.0 要求 React 19.2.7+；当前为 19.2.8 |
| Vite 兼容性 | 通过 | `@react-router/dev` 8.3.0 支持 Vite 7-8；当前为 7.2.6 |
| TypeScript 兼容性 | 通过 | 要求 TypeScript 5.1+；当前为 5.9.2 |
| Node 兼容性 | 通过 | 应用声明 Node 22.22.0+ |
| 静态发布 | 通过 | `ssr:false` 支持预渲染与静态 hosting |
| `/portal` basename | 支持，需集成验证 | Framework config 原生支持 basename |
| Jar 发布 | 支持，需调整路径 | client 输出目录与 SPA fallback 会变化 |
| ESM | 通过 | Portal 已设置 `type:module`，满足 v8 ESM-only 要求 |

## 6. Phase 1 验证要求

以下检查通过后，本 ADR 状态由“提议”更新为“接受”：

- [ ] `/portal/` 首页开发、预览和 Jar 环境均可访问。
- [ ] 至少一个预渲染二级路由刷新返回该页面 HTML。
- [ ] 至少一个非预渲染有效路由通过 `__spa-fallback.html` 正确 hydration。
- [ ] 缺失静态资源返回 404，不回退 HTML。
- [ ] `.data` 请求 Content-Type 和缓存行为正确。
- [ ] 两个 Profile 的构建图差异可证明禁用 Feature 已被裁剪。
- [ ] 浏览器 Bundle 中不存在 `PORTAL_PROFILE` 之外的未启用模块。

# Portal Phase 2 Feature 与 Profile 实施报告

> 状态：实现完成，等待 M2 验收
> 日期：2026-07-23
> 对应 Roadmap：[`portal-architecture-roadmap.md`](./portal-architecture-roadmap.md)
> 前置阶段：[`phase-1-kernel.md`](./phase-1-kernel.md)

## 1. 阶段结论

Portal 已具备业务 Feature 目录隔离、Profile 静态组合、路由生成、导航汇总、预渲染路径汇总和配置冲突校验能力。

当前提供两个可运行 Profile：

| Profile | Feature | 用途 |
|---|---|---|
| `default` | `fa-portal-home`、`fa-portal-company` | 默认官网组合 |
| `minimal` | `fa-portal-home`、`fa-portal-product`、`fa-portal-contact` | 最小可用官网组合与裁剪验证 |

切换 Profile 不需要修改 Kernel、Root、Layout 或 Router 代码：

```bash
PORTAL_PROFILE=default pnpm --filter @fa/portal run dev
PORTAL_PROFILE=minimal pnpm --filter @fa/portal run dev
```

## 2. Feature 契约

Feature 通过唯一的 `feature.ts` 公开入口暴露：

```ts
interface PortalFeature {
  id: string;
  dependsOn?: readonly string[];
  routes: readonly PortalRouteDefinition[];
  navigation?: readonly PortalNavigationItem[];
  prerenderPaths?: readonly string[];
}
```

路由使用与 React Router 构建 API 解耦的纯数据契约：

```ts
interface PortalRouteDefinition {
  id: string;
  file: string;
  path?: string;
  index?: boolean;
  children?: readonly PortalRouteDefinition[];
}
```

纯数据契约的作用：

- Feature 不直接依赖 `@react-router/dev/routes`。
- Composer 可以在生成 React Router RouteConfig 前完成冲突检查。
- 浏览器运行时只加载构建前生成的站点、导航与 Feature ID 快照。
- 构建期 RouteConfig 转换器可以独立放置，不进入客户端公开 barrel。

`definePortalFeature` 会冻结 Feature、路由、导航、依赖和预渲染路径，避免组合完成后被意外修改。

## 3. Profile 契约与静态选择

Profile 声明站点配置和启用 Feature：

```ts
export default definePortalProfile({
  id: 'default',
  site: {
    name: 'FA Portal',
    shortName: 'FA',
    description: '轻量、独立且可组合的 FA Portal。',
    baseUrl: '/portal/',
  },
  features: [homeFeature, companyFeature],
});
```

### 3.1 选择流程

```text
PORTAL_PROFILE
      ↓
scripts/select-profile.ts 校验并组合 Profile
      ↓
生成 .portal/selected-profile.ts 与 runtime-profile.ts
      ↓
RouteConfig 使用完整 Profile；Root 使用轻量运行时快照
      ↓
Vite 再校验选中的 Profile 文件
```

没有使用 `import.meta.glob`，也没有建立导入全部 Profile 的注册表。

普通 Vite alias 未被采用：React Router Framework Mode 会在 Vite 普通 alias 生效前加载 `app/routes.ts`。Portal 的 dev、typegen、check 和 build 命令会先运行 `select-profile.ts`，因此生成入口在 React Router 配置加载前已经存在。

Phase 4 增加了运行时快照：完整 Composer、路由声明、`prerenderPaths` 和内容 slug 只服务构建过程，Root/Layout 不再因为读取站点名和导航而把它们带入首屏依赖图。

`.portal` 是生成目录，已经加入 `frontend/.gitignore`。

### 3.2 环境规则

- `PORTAL_PROFILE` 默认值为 `default`。
- 名称必须匹配 `^[a-z][a-z0-9-]*$`。
- 目标文件必须存在于 `app/profiles/<name>.ts`。
- `PORTAL_PROFILE` 不使用 `VITE_` 前缀，不进入 `import.meta.env`。
- Vite mode 继续只表示 development、staging、production 等运行环境。

## 4. Composer 与失败策略

Composer 将 Kernel 保留路由和已启用 Feature 一起校验。以下情况会在 typegen、开发启动或构建阶段直接失败：

- Profile ID、Feature ID、Route ID 或 Navigation key 命名无效。
- Feature ID 重复。
- Feature 依赖缺失、重复、自依赖或循环依赖。
- Route ID 重复。
- 路由文件使用绝对路径或越过 `app` 目录。
- Index Route 同时声明 path 或 children。
- 等价路由冲突，例如 `/products/:slug` 与 `/products/:id`。
- Feature 路由与 Kernel 保留路由冲突。
- Navigation key 或目标重复。
- Navigation 指向未注册路由。
- 预渲染路径重复、无效或没有对应路由。

专用验证命令：

```bash
pnpm --filter @fa/portal run check:profiles
```

当前验证脚本覆盖：

- `default` 与 `minimal` 的 Feature、路由和导航差异。
- 重复 Feature ID。
- 缺失 Feature 依赖。
- 等价动态路由冲突。
- 重复 Navigation key。
- 没有对应业务路由的预渲染路径。

## 5. 首批示例 Feature

### 5.1 `fa-portal-home`

- 路由：`/`
- 导航：首页
- 预渲染路径：`/`
- 在 `default`、`minimal` 中启用

### 5.2 `fa-portal-company`

- 路由：`/about`
- 导航：关于我们
- 预渲染路径：`/about`
- 只在 `default` 中启用

现有首页已从 `app/routes` 迁入 Home Feature。新增 Feature 没有修改 Root 或 PortalLayout，导航由 Composer 自动汇总。

## 6. 依赖边界

Feature 规则：

- 可以导入自身代码、`app/kernel` 和 `app/shared`。
- 禁止通过相对路径深层导入另一个 Feature。
- 跨 Feature 依赖必须从对方 `feature.ts` 公开入口导入，并在 `dependsOn` 中声明。
- 禁止导入 Profile 或在 Feature 内读取 `PORTAL_PROFILE`。
- 禁止导入 Admin 页面、Admin Feature、Admin 根级 `services`/`types`。
- 禁止引入 `antd`、`@ant-design/icons` 和 `@fa/ui`。
- Feature 路由页面不能依赖仅在当前 Profile 启用时才生成的 `./+types/*`；使用稳定的 React Router 公共类型或 Feature 本地类型，保证禁用 Feature 也能被 TypeScript 检查。

README 模板：[`templates/feature-readme-template.md`](./templates/feature-readme-template.md)。

### 6.1 构建期依赖隔离

React Router RouteConfig 转换器位于：

```text
app/kernel/feature/build/createRouteConfig.ts
```

该文件不从 `app/kernel/feature/index.ts` 导出，防止 `@react-router/dev/routes` 通过客户端 Feature barrel 进入浏览器模块请求图。

## 7. 验证结果

### 7.1 契约与类型检查

以下命令通过：

```bash
pnpm --filter @fa/portal run check:profiles
PORTAL_PROFILE=default pnpm --filter @fa/portal run check
PORTAL_PROFILE=minimal pnpm --filter @fa/portal run check
```

### 7.2 路由图差异

`minimal` 运行 React Router typegen 后：

- 生成路由包含 `/`、产品、解决方案、联系页和 Kernel 路由。
- 不包含 `/about`、登录、账户、内容和聊天路由。
- 不生成 Company/Auth/Account/Content/AI Chat Route Module 声明。

`default` typegen 包含 Phase 3 的全部官网与用户 Feature。

### 7.3 浏览器差异

`default`：

- Header 显示完整官网业务导航。
- `/portal/about` 页面和 SEO title 正常。

`minimal`：

- Header 只显示“首页、产品、解决方案、联系”，不显示账户入口。
- 直接访问 `/portal/about` 进入 Portal 404。
- 浏览器请求列表不包含 `fa-portal-company` 的 feature、routes、page、CSS 或资源。
- Console 无 Error/Warning。

## 8. M2 待验收

Phase 4 已补齐生产构建验证：

- `default` 与 `minimal` 均通过同一套 gzip、SEO 和预渲染门禁。
- `minimal` 的生产路由清单与 Chunk 中不存在 Company、Content、Auth、Account 和 AI Chat Feature。
- Profile 选择机制没有把未启用 Feature 引入生产包。

详见 [`phase-4-prerender-performance.md`](./phase-4-prerender-performance.md)。

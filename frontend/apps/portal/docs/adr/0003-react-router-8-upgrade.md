# ADR-0003：Portal 升级 React Router 8

> 状态：接受
> 日期：2026-07-23
> 决策范围：`frontend/apps/portal`
> 替代决策：[`ADR-0001`](./0001-portal-architecture.md) 2.2 节中的 React Router v7 版本选择

## 1. 背景

Portal Phase 1、Phase 2 已在 React Router Framework Mode v7 上完成轻量内核与 Feature/Profile 体系。React Router 8.3.0 发布后，Portal 决定升级到当前最新稳定版，避免新模块继续建立在即将退出主维护线的 v7 基线上。

本次升级只针对独立构建的 Portal。Admin 继续使用现有 React 18 和 React Router v7，不与 Portal 共享浏览器运行时。

## 2. 决策

Portal 依赖锁定为：

```text
react-router@8.3.0
@react-router/dev@8.3.0
@react-router/node@8.3.0
react@19.2.8
react-dom@19.2.8
@types/react@19.2.17
@types/react-dom@19.2.3
```

同时执行以下迁移：

- 删除 `react-router-dom`；普通 API 从 `react-router` 导入，DOM 专用 API 如后续需要则从 `react-router/dom` 导入。
- Portal `package.json` 声明 `node >=22.22.0`。
- 保持 Vite 7.2.6、TypeScript 5.9.2 和 ESM `type:module`，均满足 v8 基线。
- 不增加 v7 的 `future.v8_*` 配置。v8 已采用这些行为，现有 Portal 没有依赖旧版 request URL、middleware context 或 trailing-slash data request 行为。
- 保持 `ssr:false`、`/portal/` basename、静态预渲染和 Profile 静态入口方案不变。

官方升级基线和迁移要求：

- [React Router 从 v7 升级](https://reactrouter.com/upgrading/v7)
- [React Router 8.3.0 Changelog](https://reactrouter.com/start/start/changelog)

## 3. 兼容性核对

| 检查项 | Portal 当前值 | React Router 8.3.0 要求 | 结果 |
|---|---:|---:|---|
| Node | `>=22.22.0` | `>=22.22.0` | 通过 |
| React | 19.2.8 | `>=19.2.7` | 通过 |
| React DOM | 19.2.8 | `>=19.2.7` | 通过 |
| Vite | 7.2.6 | 7 或 8 | 通过 |
| TypeScript | 5.9.2 | 5.1、6 或 7 | 通过 |
| 模块格式 | ESM | ESM-only | 通过 |

Portal 当前没有以下 v8 破坏性用法：

- 没有业务源码导入 `react-router-dom`。
- `meta` 没有使用已删除的 `data` 字段。
- 没有 Cloudflare React Router dev proxy。
- 没有自定义 RSC entry。
- 没有手工读取或生成 Framework Mode `.data` URL。

## 4. Workspace 隔离

Portal 使用 React 19，Admin 和 `@fa/ui` 继续使用 React 18.3.1。pnpm workspace 允许不同应用解析不同 React 主版本，但依赖必须显式绑定到所属应用：

- Portal 直接声明 React、React DOM 19.2.8。
- Admin 保持 React、React DOM 18.3.1。
- frontend workspace 根清单固定 React、React DOM 18.3.1，作为 Admin 和 `@fa/ui` 的 peer 解析基线，防止安装时被 Portal 的 React 19 提升替换。
- Portal 禁止导入 Admin 或 `@fa/ui`，所以两个 React 主版本不会进入同一浏览器 Bundle。

## 5. 验证结果

升级后以下命令均已通过：

```bash
pnpm --filter @fa/portal run check:profiles
PORTAL_PROFILE=default pnpm --filter @fa/portal run check
PORTAL_PROFILE=minimal pnpm --filter @fa/portal run check
```

浏览器冒烟结果：

- `default` 首页和 `/about` 路由正常，页面 title 正确，直接刷新可完成 hydration。
- `minimal` 不显示“关于我们”导航，直接访问 `/about` 进入 Portal 404。
- `minimal` 请求图不包含 `fa-portal-company` 源码或资源。
- 两个 Profile 的浏览器 Console 均无 Error/Warning。

按仓库约定，本次升级不执行完整生产构建；生产产物和 Spring/Jar 联调仍由 Roadmap 的 Phase 4、Phase 5 验收。

# M1 平台骨架 Alpha 实施记录

## 状态

| 项目 | 内容 |
|---|---|
| 里程碑 | M1 平台骨架 Alpha |
| 当前状态 | In Progress |
| 任务进度 | 7/8 |
| 实施日期 | 2026-07-23 |
| 未完成项 | production 性能基线与 JAR 静态资源验收 |

M1 已完成平台代码开发和开发环境验证。按照仓库约定，本次未执行完整 Vite/Maven 构建，因此不将 M1 标记为 `Ready for Acceptance` 或 `Completed`。

## 已实现能力

- React Router `8.3.0` Data Mode，固定 `basename="/h5"`。
- `/h5/`、登录壳、AppShell、401、403、404 和网络异常路由。
- 页面级动态 import、Route Error Boundary 和应用级 Error Boundary。
- Ant Design Mobile、H5 CSS Token、安全区、`100dvh`、亮色和暗色基础主题。
- `loadEnv()`、同一开发/生产 base、代理 URL 校验和 `/api` 开发代理。
- 基于原生 `fetch + AbortController` 的 API Client。
- `Ret<T>` 规范化、Token/租户/版本 Header、超时、取消、上传、下载和错误分类。
- 轻量 `BaseApi<Entity, Key>`。
- Node engine 门禁、TypeScript check、Biome lint 和代理冒烟脚本。

## 路由基线

| Router 内部路径 | 发布路径 | 用途 |
|---|---|---|
| `/` | `/h5/` | replace 到 `/app` |
| `/login` | `/h5/login` | M1 轻量登录壳 |
| `/app` | `/h5/app` | AppShell 和平台预览 |
| `/401` | `/h5/401` | 会话失效 |
| `/403` | `/h5/403` | 权限不足 |
| `/network-error` | `/h5/network-error` | 网络或代理异常 |
| `*` | `/h5/**` | H5 自有 404 |

登录、租户、权限守卫和登录后回跳属于 M3。本阶段登录按钮只进入平台预览，并在页面上明确标注不执行真实鉴权。

## API Client 边界

- 浏览器只请求同源 `/api/...`，不接收任意外部 URL。
- 默认 Header 包含 `FaFrom: FaWeb`、版本信息，可选包含 `Authorization` 和 `fa-tn-tenant-id`。
- Feature 不直接读取 Token；Token 访问集中在 `platform/auth/token-store.ts`。
- API Client 返回规范化 `Ret<T>`，业务错误、401、403、HTTP、网络、超时、取消和解析失败使用统一 `ApiError`。
- API Client 不负责 Toast、路由跳转或 Feature 状态；M3 可以通过 `RequestContextAdapter.onUnauthorized` 接入会话处理。

## 已执行验证

| 检查 | 结果 |
|---|---|
| `pnpm --filter @fa/h5 run check` | 通过；Node 门禁和 TypeScript 通过 |
| `pnpm --filter @fa/h5 run lint` | 通过；Biome 无错误 |
| `pnpm --filter @fa/h5 run proxy:smoke` | 通过；得到 Spring `401 application/json` |
| `/h5/`、`/h5/login`、`/h5/app`、未知深链接 | Vite 开发服务器均返回 HTML |
| 390×844 真实浏览器 | Home、Login、401、403、404、Network Error 可访问，无控制台错误 |

## 剩余工作与完成条件

- 使用满足 Node 要求的固定 CI 环境执行 H5 production build。
- 记录空壳、登录页和 AppShell 的 gzip JS/CSS、最大异步 Chunk 和移动端指标。
- 确认登录页不包含业务 Feature，并符合 provisional 硬上限。
- 通过 Maven/JAR 验证 `static/h5`、深链接和静态资源路径。
- 完成上述项目后，将 Roadmap M1 任务更新为 `8/8`；任务全部完成但验收未签署时标记 `Ready for Acceptance`，验收门槛全部通过后再标记 `Completed`。

## 依赖说明

- React Router `8.3.0` 要求 Node `>=22.22.0` 和 React/React DOM `>=19.2.7`，因此只将 `@fa/h5` 升级到 React `19.2.8`，Admin 继续使用 React 18。
- Ant Design Mobile `5.42.3` 的顶层 peer 支持 React 19；pnpm 仍会报告其部分动画子依赖的旧 React peer 范围。M1 使用的 Button、ConfigProvider 和 DotLoading 已通过真实浏览器验证，后续升级依赖时继续跟踪该 warning。

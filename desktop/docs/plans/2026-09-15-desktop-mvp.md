# Desktop MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 建立独立于 Web Frontend 的 Tauri Desktop 应用，完成“登录 → 空白首页 → 展示当前用户基本信息”的第一个真实业务验证闭环。

**Architecture:** `desktop` 作为根目录下独立维护的 Desktop 宿主，使用 React + TypeScript + Tauri。`fa-core-desktop` 作为私有 Git 子模块，维护 Desktop 通用组件和工具；`fa-base-desktop` 作为对应后端 `fa-base` 的业务 Feature。业务 HTTP 请求由 TypeScript 处理，Tauri/Rust 仅负责宿主和后续原生能力。

**Tech Stack:** Tauri、React、TypeScript、Vite、shadcn/ui、Tailwind CSS、pnpm、私有 Git 子模块。

---

## 1. 功能清单

| 模块 | 功能 | 功能详情 | 当前规划 | 进度 |
|---|---|---|---|---|
| Desktop 宿主 | 根目录与独立 Workspace | 建立 `desktop`，与 `frontend` 分开维护 | 执行开发 | ✅已完成 |
| Desktop 宿主 | Tauri 应用骨架 | 创建 Tauri 空窗口、Vite 开发入口和基础配置 | 执行开发 | ✅已完成 |
| 工程文档 | Desktop 模块规范 | 固化目录、命名、Feature 和子 Git 约定 | 执行开发 | ✅已完成 |
| `fa-core-desktop` | 私有 Git 基础包 | 作为本地 Workspace 包接入，不发布 NPM | 执行开发 | 🟡进行中 |
| `fa-core-desktop` | 通用 UI 组件 | 维护 shadcn/ui 基础组件、主题变量和通用状态组件 | 执行开发 | 🟡进行中 |
| `fa-core-desktop` | 通用工具包 | 维护 `cn`、类型、错误模型、Session/Token 抽象等 | 执行开发 | ✅已完成 |
| Desktop Runtime | 运行时配置 | 配置 API 地址、版本和 Desktop 请求标识 | 执行开发 | ✅已完成 |
| Desktop Runtime | TypeScript HTTP 客户端 | 支持 Token、请求错误处理和现有签名兼容 | 执行开发 | ✅已完成 |
| Desktop Runtime | 持久登录态 | 使用 WebView `localStorage` 持久化 Token，支持重启恢复登录 | 执行开发 | ✅已完成 |
| `fa-base-desktop` | 基础业务 Feature | 作为后端 `fa-base` 对应的私有 Git 页面模块 | 执行开发 | 🟡进行中 |
| `fa-base-desktop` | 登录页 | 账号、密码、提交、加载和登录错误提示 | 执行开发 | ✅已完成 |
| `fa-base-desktop` | 当前用户 | 登录后请求 `getLoginUser` 并建立页面会话 | 执行开发 | ✅已完成 |
| `fa-base-desktop` | 空白首页 | 展示用户姓名、账号及可用的基础资料 | 执行开发 | ✅已完成 |
| `fa-base-desktop` | 退出登录 | 调用退出接口并清理内存登录态，返回登录页 | 执行开发 | ✅已完成 |
| 验证 | V0 真实流程 | 验证启动、登录、用户信息、退出登录、异常和接口连通性 | 执行开发 | ✅已完成 |
| `fa-message-desktop` | 系统消息 | 使用 WebSocket 接入系统消息和未读状态 | 未来版本规划 | 🕒待处理 |
| Desktop Runtime | 系统安全存储 | 使用系统凭据或加密存储实现持久登录态 | 未来版本规划 | 🕒待处理 |
| `fa-im-desktop` | IM | 接入会话、单聊和群聊 | 未来版本规划 | 🕒待处理 |
| Desktop 宿主 | 发布与自动更新 | Tauri 打包、签名、发布和自动更新 | 未来版本规划 | 🕒待处理 |

## 2. 目标与范围

### 目标

- 建立独立于 `frontend` 的 Desktop 工程目录。
- 验证 Tauri 能够承载真实业务页面和远程 API 请求。
- 验证登录 Token 能在 Desktop 页面生命周期中正常传递。
- 登录成功后获取当前用户并展示基础信息。
- 建立后续 Feature 子 Git 的接入规范。

### V0 不包含

- 系统消息和 WebSocket。
- IM、菜单、权限和租户切换。
- 完整 Web Admin 布局。
- 记住登录、自动登录和持久 Token。
- 系统通知、托盘、自动更新和离线模式。

## 3. 目录和模块规划

```text
desktop/
├─ package.json
├─ pnpm-workspace.yaml
├─ pnpm-lock.yaml
├─ vite.config.ts
├─ tsconfig.json
├─ src/
│  ├─ main.tsx
│  ├─ app/
│  ├─ runtime/
│  ├─ shell/
│  └─ styles/
├─ packages/
│  └─ fa-core-desktop/       # 私有 Git 子模块
├─ features/
│  └─ fa-base-desktop/       # 私有 Git 子模块
├─ src-tauri/                # Desktop 宿主维护
└─ docs/
   └─ plans/
```

依赖方向保持单向：

```text
desktop 宿主 → fa-base-desktop → fa-core-desktop
desktop 宿主 → fa-core-desktop
```

`fa-core-desktop` 不依赖业务 Feature；`src-tauri` 不放入基础包或业务 Feature。

## 4. 功能开发说明

### 4.1 Desktop 宿主初始化

- 创建 `desktop/package.json` 和独立 pnpm Workspace。
- Workspace 包含 `packages/*` 和 `features/*`。
- 创建 Tauri 空窗口和 React 入口。
- 配置 Desktop 独立的开发、检查和启动命令。
- 不修改现有 `frontend` 的构建入口和业务页面。

### 4.2 `fa-core-desktop` 基础包

- 以私有 Git 子模块接入 Desktop。
- 包名使用 `@fa/core-desktop`，不发布到 NPM。
- 提供 shadcn/ui 基础组件和 Desktop 主题变量。
- 提供 Card、Input、Button、Label、Alert 等 V0 所需组件。
- 提供 Loading、Error、Empty 等通用页面状态。
- 提供通用 `HttpClient`、`TokenStore`、Session 类型和错误类型。
- 不写入 `fa-base` 的具体接口、路由或业务判断。
- 不直接实现 Tauri 窗口、文件和系统权限能力。

### 4.3 Desktop Runtime

- 定义 API 基地址和运行时配置接口。
- 由 TypeScript HTTP 客户端统一增加 Token 和公共请求头。
- 保持后端现有 URI 和请求签名协议兼容。
- 验证绝对 API 地址不会改变请求签名内容。
- 验证 Tauri 页面直接请求 API 时的 CORS 配置。
- 使用 WebView `localStorage` 持久化 Token。
- API 请求失败时给出统一错误信息，并清理失效 Session。

### 4.4 `fa-base-desktop` 业务 Feature

- 作为后端 `fa-base` 的 Desktop 业务模块。
- 包名使用 `@fa/base-desktop`。
- 对外导出登录和首页路由，不暴露内部文件路径。
- `authApi` 负责调用登录接口。
- `userApi` 负责调用当前用户接口。
- 登录成功后获取当前用户，再进入首页。
- 首页只展示基础用户信息，不复刻 Web Admin 工作台。
- 不依赖历史遗留的 `fa-admin-pages`。

### 4.5 V0 真实流程验证

- 无 Token 启动时进入登录页。
- 正确账号密码登录成功。
- 登录失败时展示错误提示。
- 登录成功后请求当前用户。
- 当前用户请求成功后进入空白首页。
- 首页展示用户姓名、账号及接口返回的可用基础字段。
- 退出登录后清理持久化 Token 并回到登录页。
- 当前用户请求失败时回到登录页。
- 关闭程序后重新启动可恢复登录态。

## 5. HTTP、Session 和原生能力边界

### HTTP

- 业务 HTTP 请求由 TypeScript 负责。
- Feature 只维护自己的 API Service。
- `fa-core-desktop` 维护通用请求接口和错误模型。
- `desktop/src/runtime` 注入 API 地址、Token 和项目运行时配置。
- 暂不复用 Web Admin 的完整请求实现，避免继承其 `window.location` 和浏览器存储假设。

### Session

- 使用 WebView `localStorage` 持久化 Token。
- 不保存用户密码。
- 通过 `TokenStore` 接口隔离存储实现。
- 后续再评估系统安全存储实现。

### Tauri/Rust

- Tauri/Rust 负责窗口生命周期和原生能力。
- Feature 不直接依赖具体 Tauri Command。
- 后续系统存储、通知、托盘等能力通过 Runtime 接口提供。

## 6. Feature 子 Git 约定

- 基础包仓库名：`fa-core-desktop`。
- 业务模块仓库名：`fa-base-desktop`、`fa-flow-desktop`、`fa-im-desktop` 等。
- 公共包使用 `@fa/*-desktop` 命名。
- 每个子 Git 至少维护 `README.md`、`package.json`、`src/index.ts` 和 `CHANGELOG.md`。
- 父项目固定子模块 commit，保证构建可复现。
- 通用能力提交到 `fa-core-desktop`，项目专属能力留在业务 Feature。
- Feature 只能依赖 `fa-core-desktop`，不允许 Feature 之间形成循环依赖。
- 子模块变更完成后，先在子模块仓库完成检查，再由父项目更新 commit 指针。
- CI 必须初始化 Git 子模块后再执行 Desktop 安装和检查。

## 7. UI 方向

- Desktop 使用 shadcn/ui + Tailwind CSS。
- `fa-core-desktop` 维护基础组件源码和主题变量。
- `fa-base-desktop` 只组合基础组件，避免复制一套 UI 实现。
- V0 登录页使用居中 Card、Input、Label、Button 和 Alert。
- V0 首页使用简单页面壳和用户信息 Card。
- 覆盖 loading、error、empty、disabled、focus 等状态。
- 不引入现有 Web Admin 的 Ant Design 页面布局。

## 8. 验收标准

- [x] `desktop` 可以独立安装依赖并启动 Tauri。
- [x] Desktop 能显示独立登录页。
- [x] 登录请求能到达后端并正确处理成功、失败结果。
- [x] 登录成功后能请求当前用户接口。
- [x] 首页能展示当前用户基本信息。
- [x] 无 Token 或 Token 失效时不会停留在空白 Loading 页面。
- [x] Tauri 开发环境和打包资源环境的 API 地址配置方式明确。
- [x] 现有 `frontend` 和未提交修改未被无关改动影响。

## 9. 风险和后续决策

- 需要验证 Tauri 页面直连 API 时的 CORS 行为。
- 需要确认请求签名使用服务端 URI，而不是完整绝对 URL。
- 需要确认 Desktop 请求标识不会意外绕过现有后端签名校验。
- 需要在正式启用持久登录前确定系统安全存储方案。
- 需要为不同项目维护 `fa-core-desktop` 的兼容 commit 或版本标签。
- 系统消息统一放入后续 `fa-message-desktop`，IM 单独放入 `fa-im-desktop`。

## 10. 相关文档

后续根据本计划补充：

- `desktop/docs/architecture.md`
- `desktop/docs/feature-module-convention.md`
- `desktop/docs/runtime-config.md`
- `desktop/docs/auth-session.md`
- `desktop/docs/ui-guideline.md`
- `desktop/docs/adr/0001-desktop-boundary.md`
- `desktop/docs/adr/0002-core-and-feature-naming.md`

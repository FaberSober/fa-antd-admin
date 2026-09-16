# Faber Desktop

基于 Tauri、React、TypeScript 和 Vite 的桌面端应用。Desktop 与 `frontend` Web 工程独立维护，但位于同一仓库根目录下。

## 开发环境

- Node.js
- pnpm `10.24.0`
- Rust、Cargo
- Windows 开发需要 WebView2 Runtime

## 常用命令

```powershell
pnpm install
pnpm dev
pnpm tauri:dev
pnpm type-check
pnpm tauri:build
```

`pnpm install` 和所有 Desktop 前端脚本都必须在本目录执行。`frontend` 继续使用自己的 pnpm Workspace 和锁文件；`src-tauri` 的 Rust 依赖由 Cargo 管理。

### Desktop 版本

`src-tauri/tauri.conf.json` 维护 `versionName`，`version.json` 维护递增的 `versionCode`。发布前使用统一命令同步前端和 Cargo 版本：

```powershell
pnpm version:set -- 0.2.0 2
pnpm version:check
```

构建脚本会自动执行 `version:check`，发现版本不一致时停止构建。

## API 配置

复制 `.env.example` 为本地环境文件后按环境修改：

```powershell
Copy-Item .env.example .env.development
```

开发环境默认使用 `/api`，由 Vite proxy 转发到 `VITE_DEV_PROXY_TARGET`；打包环境应将 `VITE_APP_API_BASE_URL` 配置为后端的完整地址。不要把真实密钥或账号密码写入环境示例文件。

### Telemetry 配置

Desktop 的 Telemetry SDK 位于 `@fa/core-desktop`，由 `fa-base-desktop` 接入登录、用户身份和生命周期事件。需要在后端 Telemetry 应用管理中创建并启用 `DESKTOP` 类型应用，然后在本地环境文件配置：

```dotenv
VITE_APP_TELEMETRY_APP_KEY=your-desktop-app-key
VITE_APP_TELEMETRY_ENV=development
```

未配置 `VITE_APP_TELEMETRY_APP_KEY` 时不会初始化上报。启用后客户端会采集启动会话、页面/登录事件、React 组件异常和未处理 Promise 异常，并通过 `/api/base/telemetry/open/error`、`/api/base/telemetry/open/event` 上报；上报失败不会影响业务请求。

### Tauri Updater 配置

`src-tauri/tauri.conf.json` 中的更新端点和 `pubkey` 为发布环境配置项。正式打包前将 `api.example.com` 替换为实际后端地址，并填入 Tauri signer 生成的公钥；私钥只保存在 CI 的安全变量中。

### 发布构建与签名

CI 按目标平台矩阵执行发布构建。发布脚本会校验版本一致性，通过临时配置注入更新公钥和接口地址，不修改仓库中的配置文件；Tauri 从环境变量读取私钥并生成更新包和 `.sig` 文件。

CI 需要配置以下变量：

| 变量 | 类型 | 说明 |
|---|---|---|
| `TAURI_SIGNING_PRIVATE_KEY` | Secret | Tauri signer 私钥内容或路径，只能存放在 CI |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | Secret，可选 | 私钥密码 |
| `TAURI_UPDATER_PUBLIC_KEY` | Variable | 与私钥匹配的公钥 |
| `TAURI_UPDATER_ENDPOINT` | Variable | 生产环境 HTTPS 更新接口地址 |

构建完成后执行签名产物校验：

```powershell
pnpm release:build
pnpm release:verify
pnpm verify:update
```

`verify:update` 使用本地 mock 服务验收无更新、平台架构匹配、更新清单、下载响应、签名文件和客户端更新接线，不需要真实发布服务器。

跨平台 CI 使用对应系统 Runner；需要指定 Rust 目标时，将参数传给 Tauri，例如 `pnpm release:build -- --target x86_64-pc-windows-msvc`。校验通过后，将安装包和相邻 `.sig` 一起上传，并把 `.sig` 文件内容填写到 `fa-app` 的安装包记录中。

## 目录约定

```text
desktop/
├─ src/                         # Desktop 宿主入口和运行时编排
├─ packages/fa-core-desktop/    # 通用 UI、HTTP、Session 和 Telemetry 基础包
├─ features/fa-base-desktop/    # 当前本地 Workspace，后续替换为 fa-base 业务 Feature 子 Git
├─ src-tauri/                   # Tauri/Rust 宿主能力
└─ docs/plans/                  # 实施计划
```

当前 `fa-core-desktop` 和 `fa-base-desktop` 先以本地 Workspace 包完成 MVP 验证。私有仓库地址确定后，将保留包名和目录不变，替换为对应的 Git submodule。

## 当前阶段

当前已完成 MVP 业务链路的代码实现：登录、当前用户查询、空白首页、退出登录和失效会话回到登录页。实际账号联调仍需后端服务、测试账号和对应运行环境；后续再将两个本地 Workspace 包替换为私有 Git 子模块。

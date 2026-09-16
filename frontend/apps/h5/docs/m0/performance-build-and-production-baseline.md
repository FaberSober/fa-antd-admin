# H5 性能、构建与生产验收基线

## 状态

Frozen for M1～M5，2026-07-23。

本文冻结 M0 阶段的 provisional 性能预算、构建证据、开发代理和生产发布验收口径。M1/M2 需要用真实依赖测量并校准目标值；降低硬上限或收紧目标值可以直接更新，放宽硬上限必须记录原因并重新评审。

## 1. M0 已核验现状

- H5 已是独立 Vite 应用，生产 base 为 `/h5/`。
- H5 当前 development base 仍为 `/`，与生产语义不一致，列入 M1 修正。
- H5 当前代理直接读取 `process.env.VITE_APP_BASE_URL`，默认回退到 `http://localhost:8080`；仓库 Spring 开发地址是 `http://127.0.0.1/`，列入 M1 修正。
- Maven 已将 `frontend/apps/h5/dist` 复制到 JAR 的 `static/h5`。
- Spring 已处理 `/h5` 尾斜杠跳转和 `/h5/**` SPA 回退；静态资源与 API 状态码仍需要在 M5 做生产矩阵验收。

这些结论来自仓库配置和源码核验，不表示已经执行 H5 构建、启动服务或完成生产部署测试。

## 2. 开发路径与代理

- 开发和生产 base 统一为 `/h5/`，Router 使用 `basename="/h5"`。
- 浏览器业务请求只使用同源相对地址 `/api/...`，Bundle 不包含生产内网地址。
- Vite 使用 `loadEnv(mode, appRoot, '')` 读取 `VITE_APP_BASE_URL`；缺省值为 `http://127.0.0.1/`。
- 代理只处理 `/api`，不改写 H5 页面和静态资源路径。
- 项目名和代理 URL 必须经过格式校验；非法 URL、非 HTTP(S) 协议或无法解析的 Project 直接阻断启动。
- 开发冒烟至少请求一个无需有效 Token 即可观察状态码的受保护接口。连接正常时必须得到 Spring JSON 的 2xx/401/403；Vite 空白 `text/plain 500`、HTML 或连接错误均判定为失败。
- 切换代理目标后必须重启 Vite，避免继续使用旧配置。

## 3. Provisional 性能预算

| 指标 | 目标值 | 硬上限 | 口径 |
|---|---:|---:|---|
| 登录页初始 JavaScript | ≤ 150 KiB | 180 KiB | gzip，总和 |
| 登录页初始 CSS | ≤ 30 KiB | 40 KiB | gzip，总和 |
| 最大业务异步 Chunk | ≤ 100 KiB | 150 KiB | gzip，单文件 |
| 首屏最大图片 | ≤ 200 KiB | 300 KiB | 原始文件 |
| LCP | ≤ 2.5 s | 4.0 s | P75 |
| INP | ≤ 200 ms | 500 ms | P75 |
| CLS | ≤ 0.1 | 0.25 | P75 |

执行规则：

- 超过目标值产生 warning 和优化任务，超过硬上限阻断阶段验收。
- M1 测量空壳、登录页和 App Shell；M2 接入真实路由、Ant Design Mobile 和 TanStack Query 后冻结最终预算。
- 登录页初始资源不能包含任一业务 Feature 页面、Admin 源码、桌面 Ant Design 或 `@fa/ui`。
- 异步 Chunk 以单文件 gzip 体积判定；不能通过无意义拆成大量微小 Chunk 绕过总加载成本分析。
- 图片必须声明尺寸，列表图片默认懒加载，优先使用 WebP/AVIF。

## 4. 目标设备与测量口径

- 主性能视口：390×844；布局回归同时覆盖 375×667、430×932 和约定平板视口。
- 实验室网络：下行 1.6 Mbps、上行 750 Kbps、RTT 150 ms；CPU 使用 4 倍降速。
- 每个候选版本至少执行 10 次无缓存冷启动，剔除工具自身失败样本后计算 P75，并保留原始报告。
- 构建体积以同一 Node、包管理器、Project 和 production mode 生成的产物为准。
- M5 接入真实用户监控后，以满足样本量的移动端 RUM P75 作为 GA 主要判断，实验室数据继续用于回归。
- 真机至少覆盖一台当前主流 iOS Safari 和一台 Android Chromium；上传、拍照、定位和后台恢复场景必须真机验证。

## 5. 构建证据

每个 Project 的生产构建必须输出或验证：

- Project ID、启用 Feature ID、路由、应用版本和 Git commit。
- 客户端模块图；出现未启用 Feature、Admin 源码、桌面 Ant Design、`@fa/ui` 或跨 Feature 深层 import 时失败。
- `build-report.json`，至少包含初始 JS/CSS、最大异步 Chunk、图片、目标值、硬上限、warning 和 error。
- Composer 结果，包括 Feature 依赖、路由、导航、首页入口和生命周期 warning。
- 独立输出目录；项目构建矩阵不得并发写入同一个生成文件或 dist。

M2 至少证明两个 Feature 集不同的 Project 能独立构建，且未启用 Feature 不进入模块图和产物。M5 将典型 Project 构建矩阵和预算检查升级为 CI 门禁。

## 6. 生产路由与状态码矩阵

| 请求 | 期望 |
|---|---|
| `/h5` | 重定向到 `/h5/` |
| `/h5/` | 返回 H5 `index.html` |
| 已注册的 `/h5/app/**` 深链接 | 返回 H5 `index.html`，由客户端路由解析 |
| 不存在的 `/h5/assets/*.js` 或 `*.css` | 真实 404，Content-Type 不能是 HTML |
| 不存在的图片、字体、`.data` 或其他带扩展名资源 | 真实 404，不回退 HTML |
| `/api/**` | 由后端/网关处理，永不进入 H5 SPA fallback |
| 客户端未知的无扩展名 H5 路径 | 可返回 H5 `index.html`，最终显示 H5 404 页面 |

JAR/镜像验收必须直接检查最终制品中的 `static/h5/index.html` 和 hash 资源，不能只检查本地 `dist`。

## 7. 缓存、压缩与发布

- `index.html` 使用 `no-cache` 或短缓存，确保能及时引用新 hash 资源。
- `/h5/assets/*` 的带 hash 资源使用长期 `immutable` 缓存。
- 网关或 Spring 至少启用 gzip；Brotli 由目标 Nginx/CDN 环境验收。
- 发布顺序先提供新 hash 资源，再切换 HTML/JAR；回滚必须恢复相互匹配的 HTML 与静态资源。
- 保留上一版本 JAR/镜像和对应构建清单，回滚后重新执行状态码矩阵。
- CSP、外部资源域、上传/下载和第三方脚本进入 M5 发布检查清单。

## 8. 监控与隐私

- 错误监控记录环境、release、Project、Feature 和路由。
- 区分客户端异常、Chunk 加载失败、代理失败、401/403、后端业务错误和资源 404。
- 核心操作可以记录脱敏业务 ID，不记录 Authorization、密码、SSO code、API Token 或敏感请求体。
- 不复用其他应用的占位 DSN；H5 使用独立应用标识。

## 9. 阶段责任

| 阶段 | 必须完成 |
|---|---|
| M1 | 统一 base、修正代理、增加 JSON 冒烟，测量空壳/登录/App Shell |
| M2 | 生成模块图和构建报告，校准最终预算，验证两个不同 Project |
| M3～M4 | 增加真实权限、消息和 CRUD 路由的移动端性能回归 |
| M5 | CI 硬门禁、RUM/错误监控、JAR 状态码矩阵、缓存压缩和回滚演练 |

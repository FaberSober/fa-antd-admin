# ADR-0001：H5 文件预览页与 Mobile WebView 复用

## 状态

Accepted，2026-09-16；开发状态：🟡进行中。

## 背景

- `mobile/` 是 uni-app Vue 3 工程，同时面向 H5、微信小程序和 App，不能直接挂载 React 组件。
- `frontend/apps/h5/` 是独立 React 应用，生产基路径为 `/h5/`，适合作为浏览器文件预览宿主。
- Admin 已使用 `@file-viewer/react` 和 Office preset，但现有 `FilePreview` 还依赖 Admin 服务、用户上下文、`@fa/ui` 和桌面端组件，不能直接导入 H5。
- 目标是在不同 Mobile 平台复用同一个在线文件预览页面，并避免在 Mobile 内维护多套 Office/PDF 预览实现。

## 决策

1. 在 H5 新增独立的全屏文件预览路由：`/h5/preview`。
2. H5 使用 `@file-viewer/react`、`@file-viewer/preset-office` 渲染文件；预览页面不套用 `/app/**` 的工作台壳，也不加入底部导航。
3. Mobile 不直接依赖 React。H5 构建使用页面跳转，微信小程序和 App 使用 `web-view` 打开 H5 URL。
4. Mobile 先通过当前登录态向后端申请一次性、短时效的预览 ticket；H5 使用 ticket 换取文件元数据和短时效文件访问 URL。
5. URL 只携带短时效 ticket，不携带长期 `Authorization` Token。ticket 交换后立即清理地址栏参数。
6. 后端负责用户、租户、RBAC、数据范围和文件访问权限校验；前端路由和按钮只负责体验层控制。

## 架构流程

```mermaid
flowchart LR
    M[Mobile uni-app] -->|授权请求 fileId| B[后端预览授权]
    B -->|一次性短时效 ticket| M
    M -->|WebView / 页面跳转| H[H5 /h5/preview]
    H -->|交换 ticket| B
    B -->|文件元数据 + 短时效 previewUrl| H
    H --> V[@file-viewer/react]
    V -->|访问 previewUrl| S[文件存储或文件流]
```

## 功能清单

| 模块 | 功能 | 功能详情 | 当前规划 | 进度 |
|---|---|---|---|---|
| 后端文件服务 | 预览 ticket / 签名 URL | 校验登录上下文，签发短时效 ticket，并兑换为可处理 Range 请求的预览 session。 | 本版本执行 | 🟡进行中 |
| H5 路由 | 全屏文件预览页 | 新增 `/h5/preview`，支持浏览器直接打开和深链接刷新。 | 本版本执行 | 🟡进行中 |
| H5 文件预览 | 接入 File Viewer | 在 H5 独立集成 React viewer 和 Office preset，按文件类型渲染。 | 本版本执行 | 🟡进行中 |
| H5 数据交换 | ticket 换取预览资源 | 获取文件名、扩展名、MIME、大小、预览地址、下载权限和水印信息。 | 本版本执行 | 🟡进行中 |
| Mobile H5 | 打开预览 URL | Mobile H5 使用页面跳转打开 H5 预览页。 | 本版本执行 | 🟡进行中 |
| Mobile 小程序 / App | WebView 容器 | 增加平台适配页，打开 H5 URL 并处理返回行为。 | 本版本执行 | 🟡进行中 |
| 安全与审计 | 凭证和文件访问保护 | 禁止长期 Token 入 URL；ticket 不记录敏感值；私密文件不依赖 fileId 保密。 | 本版本执行 | 🟡进行中 |
| 部署与资源 | H5 深链接和 viewer 资源 | 配置 `/h5/**` SPA fallback、Worker/WASM/字体资源、同源 API 或 CORS。 | 本版本执行 | 🕒待处理 |
| H5 性能 | 首屏与预览页性能测算 | 对主入口、预览异步 chunk、renderer 资源和真实设备首开耗时分别测量。 | 本版本执行 | 🕒待处理 |
| 跨平台验证 | 格式、权限和 WebView 验收 | 验证 PDF、DOCX、XLSX、PPTX、图片、文本及过期/无权场景。 | 本版本执行 | 🕒待处理 |
| 原生 / 离线预览 | 平台原生或离线能力 | 低端 WebView、不支持的格式、离线场景另行设计。 | 未来版本 | 🕒待处理 |
| 在线文档编辑 | Mobile 端 OnlyOffice 编辑 | 本 ADR 只覆盖预览，不迁移 Admin 在线编辑能力。 | 未来版本 | 🕒待处理 |

## 开发说明

### 1. 后端预览授权

- 在文件服务中增加“创建预览凭证”和“交换预览凭证”的接口；推荐复用 `base/admin/fileSave` 模块。
- 创建凭证接口使用当前 `Authorization` 和 `fa-tn-tenant-id`，校验 `fileId`、用户、租户、RBAC 和数据范围。
- ticket 使用随机不可预测值，建议 TTL 为 2～5 分钟并绑定用户、租户和文件；交换成功后单次消费。
- 交换接口返回文件元数据、短时效 `previewUrl`、`downloadAllowed` 和可选的服务端水印文本。
- 私密文件不能直接复用只按 `fileId` 访问的公开文件 URL；本地文件流和对象存储都必须受临时凭证或签名 URL 保护。

建议的接口形态：

```text
POST /api/base/admin/fileSave/createPreviewTicket
POST /api/base/admin/fileSave/exchangePreviewTicket
GET  /api/base/admin/fileSave/getPreviewFile/{session}
GET  /api/base/admin/fileSave/getPreviewDownload/{session}
```

接口名称可以沿用项目现有命名规范调整，但不得把长期 API Token 放入 URL。

### 2. H5 预览路由

- 新增 H5 文件预览 Feature，当前命名为 `fa-h5-file-preview-pages`，路由 ID 为 `fa-h5-file-preview-pages.preview`。
- 路由 path 使用 `/preview`，最终地址为 `/h5/preview`，`access` 使用 `public`；ticket 仍由后端校验。
- 预览页不加入 `navItems`、`homeEntries`，不套用 AppShell，使用全屏和移动安全区布局。
- 页面首屏只加载预览壳，viewer 和 Office renderer 使用懒加载。
- ticket 交换成功后用 `history.replaceState` 清理地址栏中的 ticket。

### 3. H5 File Viewer 集成

- 将以下依赖加入 `frontend/apps/h5`，版本与 Admin 保持一致：
  - `@file-viewer/react`
  - `@file-viewer/preset-office`
  - `@file-viewer/vite-plugin`
- 在 H5 Vite 配置中启用 renderer 资源复制，确保 Worker、WASM、字体和 vendor 资源随产物发布。
- 传给 viewer 时显式提供 `url`、`filename`、`type` 和 `size`，不要依赖无扩展名的 API URL 自动识别。
- MVP 支持图片、音视频、文本、PDF、DOCX、XLSX、PPTX、OFD；不支持的格式显示明确的不可预览状态。
- H5 自己实现轻量的文件 API 和页面状态，不导入 `fa-admin-pages`、`@fa/ui`、桌面 `antd` 或 Admin 用户上下文。
- 下载按钮、水印和错误提示以 ticket 交换结果为准；不能只依赖前端隐藏按钮实现权限控制。

### 4. Mobile 平台适配

- Mobile H5 直接跳转到完整的 H5 预览 URL；不要在 Mobile bundle 中安装或导入 React viewer。
- 微信小程序增加 `web-view` 页面，配置合法业务域名和 HTTPS；URL 参数使用标准编码。
- App 使用 uni-app `web-view` 页面打开 H5，验证 Android/iOS WebView 对 Worker、WASM、Canvas 和大文件加载的支持。
- WebView 返回时优先恢复 Mobile 原页面；预览页不依赖 H5 与 Mobile 共享 localStorage，两个应用的 Token 存储保持隔离。
- 如果后续需要“预览完成”“关闭”“下载”等双向事件，再增加受控的 WebView 消息协议，本期只要求打开和返回。

### 5. 部署与资源

- 生产环境确保 `/h5/preview` 等深链接回退到 H5 `index.html`，`/h5/assets/**` 不回退到 HTML。
- H5 与 API 尽量使用同源部署；跨域部署时同时配置 API 和文件资源的 CORS、Range、正确 MIME 和缓存策略。
- 检查对象存储重定向后的临时 URL 能被微信、Android 和 iOS WebView 访问，并在过期后失效。
- 生产包检查 Office/PDF renderer 的异步 chunk 和静态资源是否完整，避免运行时请求公共 CDN。

### 6. 安全、日志与失败处理

- 不记录 `Authorization`、ticket、签名 URL、密码或完整敏感请求体；监控只记录请求结果、文件类型和耗时等非敏感信息。
- ticket 缺失、过期、重复消费、文件不存在、无权访问时，H5 显示可解释的状态页，不跳转到 Admin 登录页。
- 后端返回 401/403 时，Mobile 和 H5 分别按自身会话处理；不能由前端路由绕过后端权限。
- 对创建 ticket 和交换 ticket 接口增加基础限流，避免凭证枚举和文件访问滥用。

### 7. 性能测算与控制

- 结论：采用路由级懒加载后，H5 登录页和 `/app/home` 的首屏不应因为 viewer 增加下载和解析成本；增加的成本集中在首次进入 `/h5/preview`。
- 预估模型如下，具体数字以生产构建和目标设备实测为准：

| 场景 | 预估新增成本 | 主要影响因素 |
|---|---|---|
| H5 登录页 / 工作台首屏 | `0` 个 viewer 资源请求，主入口不应增加 viewer 代码 | 路由是否保持异步边界、公共依赖是否被误提升 |
| 首次打开 PDF / Office | `ticket 交换 RTT + viewer 异步 chunk 下载/解析 + 文件下载/渲染` | 网络、文件大小、格式、Worker/WASM、设备 CPU |
| 同设备再次打开 | viewer 静态资源通常命中缓存，主要保留 `ticket 交换 RTT + 文件读取/渲染` | 缓存策略、文件是否变化、renderer 是否复用 |
| Mobile WebView 首次进入 | 在 H5 首次预览成本之上增加 WebView 初始化开销 | 平台 WebView 版本、内存、低端设备和网络 |

- 首屏沿用 H5 现有性能基线：登录页初始 JS 目标 ≤150 KiB gzip、CSS 目标 ≤30 KiB gzip；viewer 异步 chunk 和 Worker/WASM 资源单独统计，不能用首屏预算掩盖预览页体积。
- viewer 相关依赖只能进入预览路由的异步 chunk，不得静态进入 `bootstrap`、Providers、AppShell 或首页公共依赖。
- 分别记录 H5 首屏和首次预览的资源请求、传输体积、脚本解析时间、文件下载时间和渲染完成时间；不能只看 `dist` 文件大小。
- 至少比较以下两组数据：未接入 viewer 的 H5 基线、接入 viewer 后的 H5 产物；同时记录压缩传输体积和未压缩产物体积。
- 首屏测量重点是登录页和 `/app/home`：主入口不应请求 viewer、Office renderer、Worker 或 WASM。
- 预览测量重点是首次打开 PDF、DOCX、XLSX、PPTX，以及同一设备第二次打开；记录缓存命中后的差异。
- 在 Android、iOS、微信小程序 WebView 的代表设备上验证低端设备 CPU、内存、卡顿和大文件表现。
- 通过浏览器 Network/Performance 或等效工具保存测量结果；性能数字以实际生产构建和目标设备结果为准，不用开发服务器结果代替。
- 如果首屏主入口被 viewer 依赖污染，或目标 WebView 的首开耗时、内存和稳定性不可接受，先拆分 renderer 或调整为后端转 PDF/图片方案，再扩大功能范围。

### 8. 当前实现边界

- 当前实现使用 Redis 保存 180 秒启动 ticket；兑换后生成 600 秒预览 session，session 可被 viewer 的多次 Range 请求复用。
- H5 已按图片、音视频、文本和 Office/PDF 分流；Office viewer 通过路由级动态 import 加载，Mobile bundle 不包含 React viewer。
- 文件流统一经过预览 session 校验；本地文件直接分片输出，外部存储当前通过后端临时文件代理，后续需结合真实对象存储继续测算。
- 当前已完成代码级检查和后端编译；限流、真实 RBAC/数据范围策略、生产构建资源检查及 Android/iOS/微信 WebView 真机验证仍未完成。
- `base_file_save` 当前是全局文件表而非租户实体，首版会把创建者和租户上下文写入凭证并复用现有文件访问能力；若业务需要文件级数据范围，需在上线前补充对应授权策略。
- 现有 `getFile/{fileId}` 和 `getFilePreview/{fileId}` 公开兼容接口本期不改动；H5 预览链路不使用它们，后续如需全面收紧旧接口应另行评估调用方。

## 非目标

- 不把 React 组件直接嵌入 uni-app Vue 页面。
- 不直接复用 Admin 的 `FilePreview.tsx` 作为 H5 页面组件。
- 不通过 `?token=长期JWT` 实现 Mobile 到 H5 的登录共享。
- 不在本期实现 H5 与 Mobile 的完整 SSO、离线缓存、PWA 或 Office 在线编辑。

## 主要取舍

### 收益

- Admin、H5 和 Mobile 复用同一套浏览器文件预览能力。
- Mobile 不需要为 DOCX、XLSX、PPTX 和 PDF 分别维护原生实现。
- 预览逻辑集中在独立 H5，便于统一升级 renderer、权限和水印策略。

### 代价与风险

- Mobile 依赖网络和 H5 WebView，弱网、大文件和低版本 WebView 需要专项验证。
- 需要额外维护 ticket/签名 URL、H5 深链接和跨平台 WebView 适配。
- Office renderer 及其 Worker/WASM 资源会增加 H5 异步产物体积。

## 验收标准

- 浏览器、Mobile H5、微信小程序 WebView、Android App WebView、iOS App WebView 均可打开 `/h5/preview`。
- PDF、DOCX、XLSX、PPTX、图片和文本至少完成一组真实文件预览验证。
- ticket 过期、重复使用、文件不存在、跨租户和无权限访问均被后端拒绝。
- URL 中没有长期 Token；ticket 交换后地址栏被清理，日志和埋点不包含凭证值。
- 未授权用户不能通过猜测 `fileId` 访问私密文件；下载权限和水印策略在后端与 H5 UI 上保持一致。
- H5 深链接、静态资源、API、Worker/WASM 和对象存储临时 URL 在生产部署中均能正常工作。
- H5 首页和登录页的主入口不包含 viewer 代码，也不请求 Office renderer、Worker 或 WASM；性能报告同时包含接入前后基线对比。
- 首次预览和缓存后再次预览均有实际耗时记录，并覆盖 PDF、DOCX、XLSX、PPTX 至少各一种真实文件。
- 目标 Android、iOS 和微信小程序 WebView 完成首开、重复打开、大文件、低网速和低端设备验证；未验证的平台不得标记为完成。
- 按项目现有脚本完成 H5 类型检查、边界检查、Lint，以及 Mobile 类型检查和目标平台冒烟验证；未实际执行的检查不得标记为完成。

## 进度维护规则

- 开始编码后，将对应行更新为 `🟡进行中`；进入专项测试时更新为 `🔍验证中`。
- 只有实现和验收证据都完成后才更新为 `✅已完成`。
- 遇到外部平台、后端接口或环境依赖阻塞时使用 `🚫已阻塞`，并在开发说明或提交记录中写明原因。
- 新增功能、改变鉴权模型、改为独立共享包或扩大到离线/编辑场景时，先更新本 ADR 或新增 ADR。

## 参考

- [H5 应用与 Feature 组合架构](../m0/adr/0001-h5-application-and-feature-architecture.md)
- [H5 鉴权、Token 存储与 SSO](../m0/adr/0002-auth-session-and-sso.md)
- [历史 H5 路由迁移清单](../m0/legacy-h5-route-migration.md)
- `frontend/apps/admin/features/fa-admin-pages/components/file/FilePreview.tsx`
- `frontend/apps/admin/features/fa-admin-pages/components/file/FileViewerDocument.tsx`
- `fa-base/src/main/java/com/faber/api/base/admin/rest/FileSaveController.java`
- [H5 性能、构建与生产验收基线](../m0/performance-build-and-production-baseline.md)

# Portal Phase 5 发布与生产验收实施报告

> 状态：实现完成，等待 M5 目标环境验收  
> 日期：2026-07-23  
> 对应 Roadmap：[`portal-architecture-roadmap.md`](./portal-architecture-roadmap.md)  
> 前置阶段：[`phase-4-prerender-performance.md`](./phase-4-prerender-performance.md)

## 1. 阶段结论

Phase 5 已打通 Portal 从 React Router 构建产物到 Spring Boot 可执行 Jar 的发布链路，并完成本地真实 Jar HTTP 验收。

当前链路为：

```text
Portal 生产构建
  → 生成 dist/static 部署目录
  → Maven 复制到 BOOT-INF/classes/static
  → Spring 优先返回预渲染 HTML
  → 动态路由回退 __spa-fallback.html
  → 网关/CDN 代理同一个 Jar
```

Maven 构建、Jar 装配、预渲染路径、SPA 深链、真实资源 404、分级缓存、gzip、CSP、安全头和访问资格边界均有自动或真实 HTTP 验证。

目标服务器上的域名、TLS、Nginx/Brotli 模块和可选 CDN 规则仍需按本文清单执行 M5 环境验收。

## 2. 可部署产物与 Maven 装配

React Router 原始构建目录不直接交给 Maven。`scripts/prepare-deployment.ts` 生成唯一部署目录：

```text
dist/static/
├── robots.txt
└── portal/
    ├── index.html
    ├── __spa-fallback.html
    ├── sitemap.xml
    ├── favicon.svg
    ├── assets/
    ├── products/.../index.html
    ├── cases/.../index.html
    └── ...
```

这样 Maven 不需要理解 React Router 的 `client`、`server` 和预渲染目录结构，只复制 `frontend/apps/portal/dist/static` 到 Spring 静态资源根目录。

`fa-admin/pom.xml` 同时完成：

- Maven 内置 Node 升级为 22.22.0，与 Portal engine 一致。
- 支持 `-Dportal.profile=<profile>` 选择构建组合。
- 支持 `-Dportal.site.url=<url>` 写入生产 canonical、Open Graph、sitemap 和 robots。
- 只装配部署所需文件，不把 server build、构建报告和中间产物放入 Jar。

正式构建示例：

```bash
mvn -pl fa-admin -am -Pfrontend -DskipTests \
  -Dportal.profile=default \
  -Dportal.site.url=https://your-domain.example/portal/ \
  package
```

`portal.site.url` 必须包含最终 `/portal/` 路径。正式发布禁止保留默认 localhost URL。

## 3. Spring 路由与资源行为

`SpaErrorController` 在静态资源第一次返回 404 后按以下顺序处理：

| 请求 | 行为 |
|---|---|
| `/portal` | 重定向到 `/portal/`，保留 query string |
| `/portal/` | 返回预渲染首页 |
| `/portal/products` | 检查并转发 `/portal/products/index.html` |
| `/portal/account` | 未找到预渲染文件，转发 `/portal/__spa-fallback.html` |
| `/portal/assets/missing.js` | 返回真实 404，不返回 HTML |
| `/api/**`、`/outapi/**`、`/actuator/**` | 保持后端 404，不进入 SPA |

预渲染资源检查使用 classpath 实际存在性，不维护第二份路由白名单。新增或删除预渲染路径后，只要构建产物变化，Spring 行为会自动同步。

Controller 同时处理 Servlet context path，避免错误派发时把 context path 误判成前端路由。Portal 对外发布基路径仍固定为 `/portal/`；如外部还有额外前缀，应由反向代理剥离该前缀。

## 4. 缓存、压缩与安全策略

### 4.1 分级缓存

| 资源 | Cache-Control | 目的 |
|---|---|---|
| `/portal/assets/**` | `public, max-age=31536000, immutable` | hash 文件长期缓存 |
| `/portal/**` HTML/fallback | `no-cache` | 每次协商最新 HTML |
| `/portal/sitemap.xml`、`/robots.txt` | `public, max-age=300` | 短缓存 |

HTML 和 hash 资源必须使用不同缓存策略。CDN 不得给 HTML 增加长期缓存，也不得去掉 assets 的 immutable。

### 4.2 gzip 与 Brotli

Spring 已对 JavaScript、JSON、XML、HTML、CSS、文本和 SVG 开启 gzip，最小响应大小为 1024 字节。真实 Jar 验收确认 JavaScript 返回 `Content-Encoding: gzip`。

Nginx/CDN 推荐优先返回 Brotli，不支持 Brotli时回退 gzip。参考配置：

- [`portal-production-nginx.conf.example`](./portal-production-nginx.conf.example)

示例对 `/api/portal/ai/**` 关闭代理缓冲和压缩，保证智能体 SSE 事件及时送达；普通 HTML 和静态资源保留代理缓冲与压缩。

### 4.3 CSP 与浏览器安全头

Portal 响应现在包含：

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- 禁用 camera、microphone 和 geolocation 的 `Permissions-Policy`

当前 Portal 客户端没有第三方运行时脚本、外部字体或外部图片，默认 CSP 只允许同源资源。React Router hydration 需要内联引导脚本，因此 `script-src` 暂时保留 `'unsafe-inline'`。

后续接入统计、客服、地图、对象存储或 CDN 域名时，必须逐项评审并只放行对应 directive，不能直接使用 `*`。如要移除 `'unsafe-inline'`，应先实现 nonce/hash 并验证全部预渲染页面。

## 5. 访问控制矩阵

| 入口 | 身份 | 应用级校验 | 后续权限 |
|---|---|---|---|
| Portal 公开接口 | 无登录 | 显式 `@IgnoreUserToken` | 接口自身校验/限流 |
| `/api/portal/**` | `base_user` Token | 账号有效，不要求 `admin_enabled` | 用户资源归属、智能体授权、配额 |
| Admin 登录 | `base_user` | `admin_enabled = 1` | 登录后进入 RBAC |
| 非 Portal `/api/**` | `base_user` Token | 每次请求读取最新用户并要求 `admin_enabled = 1` | 原有 RBAC/接口权限 |
| `/outapi/**` | API Key | 独立 API Token 拦截器 | OpenAPI 自身授权 |
| 系统内部操作 | 显式内部注解 | 不依赖普通 Portal 路径判断 | 内部调用边界 |

`UserAuthRestInterceptor` 的路径判断已收敛为 `/api/portal` 或 `/api/portal/**`，`/api/portal-admin` 等相似前缀不会被误放行。

每次受保护请求都会重新从数据库读取 `base_user`。测试覆盖了用户从 `admin_enabled = 1` 改为 `0` 后，下一次 Admin API 请求立即失败，而 Portal API 保持可用。因此不依赖 Token 过期或重新登录。

## 6. 自动生产验收命令

生产实例启动后执行：

```bash
PORTAL_PROFILE=default \
pnpm --filter @fa/portal verify:production -- \
  --url https://your-domain.example/portal/ \
  --prerender-path /products \
  --spa-path /account
```

`verify:production` 会验证：

- `/portal` 尾斜杠重定向。
- 首页与预渲染页面正文。
- 非预渲染 SPA 深链。
- Portal CSP、nosniff 和 HTML no-cache。
- 真实 hash JavaScript 的一年 immutable 与 gzip/Brotli。
- 缺失静态资源为非 HTML 404。
- sitemap、robots 的状态、类型与短缓存。

该命令应分别对 Jar 直连地址、反向代理内网地址和公网域名执行。启用 CDN 时还应对 CDN 域名执行一次。

## 7. 本阶段验证记录

2026-07-23 本地验证结果：

| 验证项 | 结果 |
|---|---|
| Portal TypeScript/typegen | 通过 |
| 后端局部测试 | 10 个通过，0 失败 |
| default Portal 生产构建 | 14 个预渲染路径，通过 |
| 首页初始 JS gzip | 110.21 KiB，低于 120 KiB 目标 |
| 最大 JS Chunk gzip | 57.61 KiB，低于 80 KiB 目标 |
| Maven `-Pfrontend` 全链路 | BUILD SUCCESS |
| 可执行 Jar 静态资源装配 | 首页、fallback、预渲染 HTML、assets、sitemap、robots 均存在 |
| Jar 直接运行 | Spring Boot 启动成功 |
| `verify:production` 对真实 Jar | 全部通过 |
| 缺失 JS | 404、空响应体、非 HTML |
| hash JS | 一年 immutable，gzip |

本机没有安装 Nginx，因此示例配置未在本机执行 `nginx -t`。目标服务器发布前必须完成该项，并在代理后重新执行 `verify:production`。

## 8. 发布检查清单

### 8.1 发布前

- [ ] 确认发布版本、Git commit、Portal Profile 和生产域名。
- [ ] 确认 `portal.site.url` 不是 localhost，且以 `/portal/` 结尾。
- [ ] 运行相关后端测试、Portal `check` 和目标 Profile 生产构建。
- [ ] 确认构建报告无 warning/error，性能预算未突破。
- [ ] 确认 Jar 内存在 Portal 首页、fallback、预渲染页面和 hash assets。
- [ ] 使用独立端口启动新 Jar，执行 `verify:production`。
- [ ] 对照 CSP 检查本次新增第三方域名；没有新增则不扩大白名单。
- [ ] 在目标服务器执行 `nginx -t`，确认 Brotli 模块是否真实可用。
- [ ] 记录旧版本 Jar/镜像、配置和数据库版本，确认可回滚。

### 8.2 切换期间

- [ ] 先启动新实例并等待健康检查通过，再加入 upstream。
- [ ] 对新实例直连执行生产验收命令。
- [ ] 逐步切换流量，不直接覆盖正在运行的旧 Jar。
- [ ] 保留旧实例和旧 hash 静态资源，直到旧 HTML/CDN 缓存自然过期。
- [ ] 如使用独立 CDN，先发布新 hash assets，再切换 HTML。
- [ ] 观察 5xx、静态资源 404、登录失败、SSE 中断和响应时延。

### 8.3 发布后

- [ ] 分别验证首页、产品页、登录、账户和智能体聊天深链刷新。
- [ ] 再次执行 `verify:production`。
- [ ] 验证普通 Portal 用户调用 Admin API 被拒绝。
- [ ] 抽样关闭一个测试用户的 `admin_enabled`，确认旧 Token 下一次 Admin 请求失败。
- [ ] 验证 gzip/Brotli、缓存头、CSP 和 TLS。
- [ ] 验证 sitemap、robots 和生产 canonical。
- [ ] 记录发布时间、验收人、指标和异常，保留旧版本至少一个回滚窗口。

## 9. 无资源 404 的发布方式

Portal HTML 和 hash assets 被装在同一个 Jar 中，单实例启动时天然保持版本一致。生产切换推荐蓝绿或滚动发布：

1. 保留旧实例运行。
2. 启动新 Jar，等待健康检查。
3. 对新实例直连执行自动验收。
4. 将新实例加入 upstream，再逐步摘除旧实例。
5. 等待 HTML/CDN 短缓存过期后再删除旧版本资源。

禁止在运行目录中先删除旧 assets、再覆盖 HTML。若静态资源独立部署到 CDN，至少保留最近两个版本的 hash 文件。

## 10. 回滚策略

Phase 5 没有数据库结构变更，应用回滚以切换上一个完整 Jar/镜像为主：

1. 触发条件：持续 5xx、核心路由不可用、静态资源 404、登录/聊天主链路故障或安全策略误拦截。
2. 停止继续放量，将 upstream 切回上一个已验收实例。
3. CDN 若已切换 HTML，回滚 HTML；hash assets 不删除。
4. 对旧版本执行 `verify:production`，确认恢复。
5. 保存新版本日志、构建报告和失败请求，建立问题记录。

未来含数据库迁移的版本必须采用向后兼容迁移：先扩展、再发布应用、最后清理旧字段。不可回滚的数据变更需要单独的数据恢复方案，不能只依赖回退 Jar。

## 11. 发布版本记录模板

| 字段 | 记录值 |
|---|---|
| 发布版本/标签 | |
| Git commit | |
| Jar/镜像 SHA-256 | |
| Portal Profile | |
| `portal.site.url` | |
| 构建报告 | |
| 数据库版本 | |
| Nginx/CDN 配置版本 | |
| 上一个可回滚版本 | |
| 发布时间/负责人 | |
| `verify:production` 结果 | |
| 业务验收人 | |
| 异常与处置 | |

## 12. M5 目标环境验收

开发与本地 Jar 验收已经完成。M5 关闭前还需在实际目标环境确认：

- 正式域名、证书、HSTS 与代理转发头。
- Nginx 配置语法以及 Brotli 模块/CDN 压缩能力。
- CDN 对 HTML、hash assets、sitemap 和 robots 的最终缓存头。
- 蓝绿/滚动切换期间的静态资源 404 监控。
- 真实 Portal 普通用户、Admin 用户和 API Key 的访问矩阵。
- 生产智能体 SSE 长连接、超时和中断恢复。

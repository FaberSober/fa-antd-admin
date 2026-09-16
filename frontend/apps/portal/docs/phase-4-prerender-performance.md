# Portal Phase 4 预渲染与性能实施报告

> 状态：实现完成，等待 M4 验收  
> 日期：2026-07-23  
> 对应 Roadmap：[`portal-architecture-roadmap.md`](./portal-architecture-roadmap.md)  
> 前置阶段：[`phase-3-website-user-mvp.md`](./phase-3-website-user-mvp.md)

## 1. 阶段结论

Phase 4 已完成稳定公开页预渲染、动态内容路径汇总、sitemap/robots、SEO 结构化数据、生产资源预算、Profile 产物裁剪和真实浏览器预览验收。

默认 Profile 当前生成 14 个预渲染页面，minimal Profile 生成 7 个。登录、注册、账户、智能体聊天等实时用户页面继续使用 SPA fallback，不进入 sitemap。

生产构建现在是自验收流程：

```text
选择并校验 Profile
  → React Router/Vite 构建与预渲染
  → 生成 sitemap、robots
  → 校验 HTML/SEO、gzip 预算、图片预算、SPA fallback
  → 校验未启用 Feature 不残留
  → 输出 dist/build-report.json
```

## 2. 预渲染与构建期动态路径

`react-router.config.ts` 直接使用当前组合的 `portalComposition.prerenderPaths`。每个 Feature 只声明自己负责的路径：

- Home、Company、Contact 声明固定公开路径。
- Product 从 `portalProducts` 的 slug 生成详情路径。
- Content 从 `portalCases`、`portalNews` 的 slug 生成详情路径。
- Composer 校验路径格式、重复路径及其对应路由。

这套机制也是后续接入 CMS snapshot 的扩展点：构建前先生成稳定内容快照，再由 Feature 将 slug 映射为 `prerenderPaths`，不需要把 CMS 请求放进浏览器运行时。

默认 Profile 预渲染范围：

- `/`
- `/products`、`/solutions`
- 3 个产品详情
- `/cases`、`/news`
- 2 个案例详情、2 个新闻详情
- `/about`、`/contact`

## 3. SEO 输出

### 3.1 页面 Meta

`createPortalMeta` 统一生成：

- title、description
- canonical
- Open Graph title、description、type、url
- Twitter card、title、description
- JSON-LD
- 非公开或不存在页面的 `noindex,nofollow`

所有公开页面至少包含 `WebPage` JSON-LD。产品详情附加 `SoftwareApplication`，案例详情附加 `Article`，新闻详情附加 `NewsArticle`。

React Router 8.3.0 原生支持 `{"script:ld+json": ...}` MetaDescriptor，构建门禁会检查每个预渲染 HTML 中的 JSON-LD、canonical 和 Open Graph。

### 3.2 sitemap 与 robots

`scripts/generate-public-assets.ts` 根据当前 Profile 的预渲染路径生成：

- `/portal/sitemap.xml`
- 站点根路径 `/robots.txt`

robots 允许抓取 `/portal/`，并排除 login、register、account 和 chat。生产构建必须提供真实的：

```bash
VITE_PORTAL_SITE_URL=https://your-domain.example/portal/
```

未配置时本地构建使用 `http://localhost:9001/portal/` 生成调试文件并给出警告；正式发布不能使用该回退值。

## 4. 首屏依赖优化

Phase 4 基线发现 Root/Layout 为读取站点名、导航和 Feature ID，间接加载了完整 Composer、路由声明、产品列表和文章列表。

新增 `scripts/select-profile.ts` 后，构建前会生成两个静态入口：

- `.portal/selected-profile.ts`：供 RouteConfig、预渲染和构建检查使用。
- `.portal/runtime-profile.ts`：只包含 site、navigation、featureIds，供 Root/Layout 使用。

优化结果：

- 默认 Profile 首页初始 JS 从 115.10 KiB 降至 110.09 KiB gzip。
- 首页初始预加载资源从 20 个降至 18 个。
- Product/Content 静态内容不再因为 Root 导航进入首页依赖图。
- Root Chunk 从 12.25 kB 降至 5.31 kB（构建输出原始大小）。

页面继续由 React Router 按路由拆包。当前最大业务异步页面是 AI Chat，9.52 kB 原始大小、3.97 KiB gzip，暂无需要继续拆分的重型页面内部模块。

## 5. 自动性能与产物门禁

`scripts/check-build-output.ts` 随 `pnpm build` 自动执行。

| 指标 | 目标值 | 硬上限 | default | minimal |
|---|---:|---:|---:|---:|
| 首页初始 JS gzip | 120 KiB | 150 KiB | 110.09 KiB | 108.21 KiB |
| 首页初始 CSS gzip | 25 KiB | 35 KiB | 4.94 KiB | 4.94 KiB |
| 最大 JS Chunk gzip | 80 KiB | 120 KiB | 57.54 KiB | 57.54 KiB |
| 最大图片原始大小 | 200 KiB | 300 KiB | 0.49 KiB | 0.49 KiB |

规则：

- 超过目标值给出构建警告。
- 超过硬上限直接构建失败。
- 首屏预算从首页 HTML 的 modulepreload 和 stylesheet 计算，避免只看单个文件。
- 每个预渲染页面必须包含主要正文、H1、title、description、Open Graph 和 JSON-LD；配置站点 URL 时还必须匹配 canonical/OG URL。
- 必须存在 SPA fallback、sitemap 和 robots。
- Vite 客户端 module ID 图中出现未启用 Feature、Admin、Ant Design 或 `@fa/ui` 时直接失败。

当前没有内容位图，只有 0.49 KiB SVG favicon。图片格式、尺寸、`srcset`、懒加载和布局稳定规则继续遵循 [`portal-assets.md`](./portal-assets.md)；HTTP 缓存和压缩响应头由 Phase 5 配置。

## 6. Profile 裁剪验证

default 生产构建：

- 157 个客户端模块。
- 14 个预渲染页面。
- 完整官网、认证、账户与 AI Chat Feature。

minimal 生产构建：

- 133 个客户端模块。
- 7 个预渲染页面。
- 仅 Home、Product、Contact。
- 不包含 About、Cases、News、Login、Register、Account、AI Chat 路由或业务 Chunk。

两套构建均通过相同的预算和 SEO 门禁，Phase 2 的“未启用 Feature 不进入生产产物”验收项已经完成。

## 7. 生产预览与等价性能基线

原 `vite preview` 会剥离 Vite base，无法直接映射 React Router 在 `dist/client/portal/**` 生成的预渲染文件。Phase 4 新增 `scripts/preview.ts`，按最终部署语义映射：

- `/portal/assets/**` → `dist/client/assets/**`
- 公开预渲染路径 → `dist/client/portal/**/index.html`
- `/portal/sitemap.xml` → sitemap XML
- `/robots.txt` → 根 robots
- 非预渲染页面 → `dist/client/index.html`
- 缺失 JS/CSS/图片等静态资源 → 真实 404

Playwright 在本机生产预览上的等价基线：

| 项目 | 结果 |
|---|---:|
| DOMContentLoaded | 69 ms |
| Load | 71 ms |
| First Contentful Paint | 136 ms |
| 首页资源请求 | 20 |
| Console Error/Warning | 0 / 0 |

该数据用于本机回归比较，不替代真实网络和真实用户监控。预览服务器故意不启用 gzip/Brotli，因此传输量以构建期 gzip 门禁为准。

浏览器行为验证：

- 预渲染首页和产品详情直接访问正常。
- SPA 登录深链接直接访问并正确渲染。
- 未知业务路径进入 Portal 404 页面。
- sitemap 返回 `application/xml`。
- robots 返回 `text/plain`。
- 缺失静态资源返回 404，不回退 HTML。

## 8. 命令

默认 Profile 完整生产构建：

```bash
PORTAL_PROFILE=default \
VITE_PORTAL_SITE_URL=https://your-domain.example/portal/ \
pnpm --filter @fa/portal build
```

minimal Profile 独立目录验证：

```bash
PORTAL_PROFILE=minimal \
PORTAL_BUILD_DIRECTORY=.phase4/minimal \
VITE_PORTAL_SITE_URL=https://your-domain.example/portal/ \
pnpm --filter @fa/portal build
```

生产产物预览：

```bash
pnpm --filter @fa/portal preview
```

重复执行已有产物门禁：

```bash
VITE_PORTAL_SITE_URL=https://your-domain.example/portal/ \
pnpm --filter @fa/portal check:build
```

## 9. M4 验收与 Phase 5 边界

M4 代码和自动验证已完成，等待业务/技术验收以下内容：

- 正式生产域名与 canonical。
- 正式品牌内容和分享图片。
- 目标设备与真实网络上的体验抽样。

以下工作明确进入 Phase 5：

- Maven 将 React Router 客户端产物映射到最终 Spring 静态目录。
- Spring 预渲染优先、SPA fallback 和缺失资源 404。
- hash 资源、HTML、sitemap、robots 的分级缓存。
- 网关/CDN gzip 或 Brotli。
- Jar、反向代理与发布回滚验收。

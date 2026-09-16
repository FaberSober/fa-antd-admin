# Portal Feature 与 Profile 目录

> 此文件由 `scripts/generate-feature-catalog.ts` 生成。修改 Feature/Profile 后执行 `pnpm --filter @fa/portal generate:catalog`，CI 使用 `check:catalog` 防止文档漂移。

## Feature 目录

| Feature | 生命周期 | 依赖 | 路由 | 预渲染数 | 启用 Profile |
|---|---|---|---|---:|---|
| `fa-admin-pages` | active | — | `/`、`/about`、`/products`、`/products/:slug`、`/solutions`、`/cases`、`/cases/:slug`、`/news`、`/news/:slug`、`/contact`、`/login`、`/register`、`/account` | 14 | `default`、`minimal` |
| `fa-ai-pages` | active | `fa-admin-pages` | `/chat/:accessToken` | 0 | `default` |

## 依赖关系

```mermaid
graph LR
  "fa-ai-pages" --> "fa-admin-pages"
```

箭头表示“左侧 Feature 依赖右侧 Feature”。代码级跨 Feature 引用还必须只指向目标 `feature.ts` 公开入口。

## Profile 组合

| Profile | 站点名称 | Feature |
|---|---|---|
| `default` | FA Portal | `fa-admin-pages`、`fa-ai-pages` |
| `minimal` | FA Portal | `fa-admin-pages` |

## 维护规则

- Feature 目录名必须等于 Feature ID。
- Profile 文件名必须等于 Profile ID，并静态导入 Feature 的 `feature.ts`。
- 新增、删除、废弃 Feature 或修改 Profile 后必须重新生成本文件。
- 自动边界规则和人工完成定义见 `phase-6-engineering.md`。

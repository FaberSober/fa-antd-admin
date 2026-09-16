# 历史 H5 路由迁移清单

## 背景

Admin Feature 内曾通过 `vite-plugin-pages` 提供 `/h5/**` 页面；现在仓库已经存在独立 `frontend/apps/h5`，Spring 在生产环境会把 `/h5/**` 深链接回退到 `/h5/index.html`。因此旧页面在 Admin 开发服务器中仍可能可见，但在打包后的生产拓扑中已不再是 `/h5/**` 的实际入口。

## 已发现的历史文件

| 文件 | 历史职责 | 处理结论 |
|---|---|---|
| `fa-admin-pages/pages/h5.tsx` | `/h5` 布局 | M5 删除 |
| `fa-admin-pages/pages/h5/in.tsx` | 从 query 读取 Token，加载登录用户布局 | 不迁移 Token 逻辑，M5 删除 |
| `fa-admin-demo-pages/pages/h5/in/demo/userinfo/index.tsx` | 用户信息 Demo | 迁移到 `/app/me` 后 M5 删除 |

## 路由映射

| 历史 URL | 新 URL/行为 | 兼容策略 |
|---|---|---|
| `/h5` | `/h5/` | 继续由 Spring 重定向尾斜杠 |
| `/h5/` | `/h5/app/home` 或 `/h5/login` | H5 根据会话 replace 导航 |
| `/h5/in` | `/h5/app/home` | 有有效共享会话时跳转，否则进入登录页 |
| `/h5/in/demo/userinfo` | `/h5/app/me` | H5 内部永久 replace |
| `/h5/in?token=...` | 不接受长期 Token | 发行方必须迁移；不复制旧逻辑 |

## 迁移阶段

### M1：建立兼容入口

- 在新 H5 路由层识别 `/in` 和 `/in/demo/userinfo`。
- 兼容路由只做目标 path replace，不加载旧 Admin 组件。
- 记录命中次数、来源页面和是否携带 `token` 参数，但绝不记录参数值。
- 确认 `/h5/**` 在开发和 JAR 环境都进入独立 H5。

### M3：调用方迁移

- Portal 和仓库内链接统一改到 `/h5/` 或新业务路由。
- Product/Operations Owner 盘点邮件、二维码、外部系统和文档中的旧链接。
- 携带长期 Token 的链接必须停止生成。
- 如确需 SSO，先完成一次性 code 交换方案再迁移发行方。

### M5：删除旧代码

- 兼容路由至少保留两个正式发布周期，具体窗口由 Product Owner 确认。
- 旧路由无调用或迁移窗口结束后，删除 Admin 中三个历史文件。
- 回归 Admin `/login`、`/admin/**`、H5 `/h5/**` 和 Portal `/portal/**` 的 SPA 回退。
- 根据使用数据决定是否继续保留 `/in` 路径重定向。

## 风险

### 长期 Token 暴露

历史 `/h5/in.tsx` 直接读取 query token 并保存。URL 可能进入浏览器历史、Referer、截图和代理日志。新 H5 禁止复制该实现。

### 开发/生产行为不一致

Admin dev server 仍能扫描旧 `pages/h5`，而生产 Spring 优先把 `/h5/**` 交给独立 H5。M1 应统一开发入口，并在 M5 删除旧页面消除差异。

### 未知外部链接

仓库内未发现 `/h5/in` 调用方不代表线上没有外部链接。删除前必须依靠访问统计和业务方确认，而不是只做代码搜索。

## 验收清单

- [ ] `/h5` 正确跳转 `/h5/` 并保留合法 query。
- [ ] `/h5/` 根据会话进入 Home 或 Login。
- [ ] `/h5/in` 不读取 query Token。
- [ ] `/h5/in/demo/userinfo` replace 到 `/h5/app/me`。
- [ ] 监控不记录 Token 值。
- [ ] 外部旧链接发行方清单已完成。
- [ ] 两个发布周期后完成旧 Admin 文件删除评审。

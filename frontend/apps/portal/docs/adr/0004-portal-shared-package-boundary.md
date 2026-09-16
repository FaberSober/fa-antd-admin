# ADR-0004：Portal 稳定共享能力暂不提升为 workspace package

> 状态：接受  
> 日期：2026-07-23  
> 决策范围：`frontend/apps/portal/app/kernel`、`frontend/apps/portal/app/shared`

## 1. 背景

Phase 6 需要评估是否把 Portal Kernel 或 Shared 提升为独立 workspace package，以便多个项目复用。

当前不同项目通过 Profile 组合同一个 Portal 应用，不是多个独立 Portal 应用。`frontend/fa-ui/packages/*` 主要服务 Admin 的 React 18、Ant Design 和后台组件体系，Portal 使用 React 19、轻量 CSS 和独立路由运行时，直接放入 `@fa/ui` 会重新引入需要隔离的依赖。

## 2. 决策

当前不抽取新的 workspace package，继续保留：

- `app/kernel`：Portal 运行时、Feature/Profile 契约、认证、HTTP、SEO 和布局。
- `app/shared`：Portal 内部无业务语义的样式、组件和工具。
- `app/features`：项目可组合的业务能力。

Profile 已经解决同一应用内不同项目的源码组合问题；此时抽包只会增加发布版本、peer dependency、React 单例和变更协调成本，不会带来真实的第二消费方。

## 3. 提升为 package 的触发条件

能力同时满足以下条件后再立项：

1. 至少有两个独立 workspace 应用作为真实消费方，而不是两个 Profile。
2. API 在至少两个发布周期内稳定。
3. 不依赖具体 Profile、路由文件、业务内容、Portal DOM 布局或 Admin 运行时。
4. 可声明清晰的 peer dependencies，并验证不会打入第二份 React/Router。
5. 有独立单元测试、版本策略、Changeset 和迁移说明。
6. 抽取后不会突破 Portal 性能预算。

## 4. 候选能力评估

| 能力 | 当前结论 | 原因 |
|---|---|---|
| Feature/Profile 契约 | 保留 Kernel | 只有 Portal 一个消费方，且与路由构建强关联 |
| HTTP fetch 封装 | 暂不抽取 | Portal 的认证和错误协议仍在演进 |
| SEO helpers | 保留 Kernel | 与 Portal site config、basename 和预渲染耦合 |
| Auth Context | 保留 Kernel | 依赖 `base_user` 与 `/api/portal/**` |
| Breadcrumbs/页面样式 | 保留 Shared | 与当前 Portal 视觉和 HTML 结构相关 |
| 纯字符串/URL 工具 | 观察 | 出现第二消费方后可优先抽取 |

## 5. 未来目录建议

满足触发条件后优先建立 `frontend/packages/portal-kit`，不要放入 Admin 的 `@fa/ui`：

```text
frontend/packages/portal-kit/
├── package.json
├── src/
├── tests/
└── CHANGELOG.md
```

届时同步更新 `pnpm-workspace.yaml`，使用明确 exports，禁止聚合导出导致未使用能力进入 Portal Bundle。

## 6. 影响

- 当前 Profile 组合保持最小复杂度和最强静态裁剪。
- Phase 6 的自动边界门禁防止 Kernel/Shared 反向依赖 Feature。
- 当第二个独立应用出现时，需要重新评审本 ADR，而不是直接复制 Portal 内部目录。

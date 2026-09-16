# Portal Phase 6 工程化增强实施报告

> 状态：实现完成，等待 M6 CI/团队流程验收  
> 日期：2026-07-23  
> 对应 Roadmap：[`portal-architecture-roadmap.md`](./portal-architecture-roadmap.md)  
> 前置阶段：[`phase-5-release-production-acceptance.md`](./phase-5-release-production-acceptance.md)

## 1. 阶段结论

Phase 6 已把 Feature/Profile 的目录规范从人工约定提升为可生成、可发现、可校验、可持续构建的工程体系。

当前默认检查链路：

```text
依赖边界
  → Feature/Profile 契约与生命周期
  → 自动发现全部 Profile 的组合矩阵
  → 脚手架夹具
  → Feature 目录文档防漂移
  → React Router typegen
  → TypeScript
```

GitHub Actions 另外对 `default`、`minimal` 两个典型 Profile 执行独立生产构建和 Phase 4 性能/产物门禁。

## 2. Feature 创建脚手架

创建一个公开、可预渲染、带导航的 Feature：

```bash
pnpm --filter @fa/portal create:feature -- \
  --id fa-pricing-pages \
  --route pricing \
  --label "产品定价" \
  --description "查看产品版本和定价。" \
  --depends-on fa-admin-pages
```

可选参数：

- `--no-navigation`：不生成导航声明。
- `--no-prerender`：不生成预渲染路径。
- `--dry-run`：只展示目标，不写文件。
- `--output <directory>`：指定输出根目录，供夹具或外部工具使用。

生成内容：

```text
app/features/fa-pricing-pages/
├── feature.ts
├── routes.ts
├── README.md
└── pages/
    ├── pricing.tsx
    └── pricing.module.css
```

生成页面已经包含 Meta、Breadcrumbs、CSS Module、语义化 H1 和基本 README。脚手架不会自动修改 Profile，避免新 Feature 意外进入所有项目；开发者必须在目标 Profile 中显式静态导入。

安全规则：

- Feature ID 必须为 `fa-<backend>-pages`，与根目录后端模块对应；`fa-core`、`fa-base` 统一使用 `fa-admin-pages`。
- 初始路由必须为单段 kebab-case；复杂嵌套路由在生成后按契约扩展。
- 依赖去重并禁止自依赖。
- 目标目录存在时直接失败，不支持 `--force` 覆盖。
- 文件先写入同级临时目录，再原子移动到目标目录，避免生成半成品。

## 3. Profile 创建脚手架

```bash
pnpm --filter @fa/portal create:profile -- \
  --id customer-a \
  --name "Customer A" \
  --short-name "CA" \
  --description "Customer A 官网门户。" \
  --features fa-admin-pages,fa-ai-pages
```

Profile 脚手架自动发现 `app/features/*/feature.ts`，并校验：

- 所选 Feature 全部存在。
- 没有重复 Feature。
- `dependsOn` 依赖全部包含在当前组合中。
- 新 Profile 不启用 deprecated Feature。
- base URL 以 `/` 开头和结尾。
- 同名 Profile 不被覆盖。

生成文件只包含静态 import，不使用 `import.meta.glob` 或运行时 Feature 筛选，因此未启用 Feature 仍可被 Vite 完整裁剪。

## 4. 自动依赖边界

`scripts/check-boundaries.ts` 自动发现全部 Feature、Profile 和 `app` 源码，并检查：

- Feature 目录名等于 Feature ID。
- 每个 Feature 具备 `feature.ts`、`routes.ts`、`README.md` 和 `pages`。
- 路由文件只能位于所属 `features/<id>/**`。
- 全目录 Feature 依赖存在且无循环。
- Profile 文件名等于 Profile ID。
- Profile 只能导入 Feature 的 `feature.ts`，禁止深层导入。
- 非 Profile 的 Kernel、Shared、Root 等模块禁止反向导入 Feature。
- Feature 跨目录导入只能指向对方 `feature.ts`，且必须声明 `dependsOn`。
- Feature 禁止导入 Profile、读取 `PORTAL_PROFILE` 或读取项目装配环境。
- Portal 禁止导入 Admin 源码、Ant Design、`@fa/ui` 和 `@fa/icons`。
- Profile 禁止 `import.meta.glob`。

检查失败会列出源文件、目标 import 或契约问题，并直接阻止 `pnpm check` 和 CI。

## 5. Feature 目录与 Profile 矩阵

目录文档由实际源码生成：

- [`feature-catalog.generated.md`](./feature-catalog.generated.md)

更新命令：

```bash
pnpm --filter @fa/portal generate:catalog
```

`check:catalog` 会重新计算预期内容并逐字比较，新增 Feature、修改依赖、路由、生命周期或 Profile 后未更新文档时 CI 失败。

`check:matrix` 不维护手工 Profile import 列表，而是自动读取 `app/profiles/*.ts`，对每个 Profile 执行完整 Composer 校验并输出 Feature、路由、导航、预渲染和 warning 数量。

当前矩阵：

| Profile | Feature | Route | Navigation | Prerender | Warning |
|---|---:|---:|---:|---:|---:|
| default | 8 | 17 | 7 | 14 | 0 |
| minimal | 3 | 8 | 4 | 7 | 0 |

## 6. CI 组合矩阵

新增 [`.github/workflows/portal-quality.yml`](../../../../.github/workflows/portal-quality.yml)：

- PR、main push 或手动触发。
- 只在 Portal 或前端 workspace 关键文件变化时运行。
- 固定 Node 22.22.0、pnpm 10.24.0。
- Engineering job 运行完整 `pnpm --filter @fa/portal check`。
- Profile matrix 分别生产构建 `default`、`minimal`。
- 每个构建继续执行预渲染、SEO、模块图、性能预算和部署目录门禁。
- `build-report.json` 保留为 14 天 CI artifact。
- `fail-fast: false`，一个组合失败时仍能看到另一个组合结果。

新增典型 Profile 时，需要在 workflow matrix 中加入其 ID；所有 Profile 即使未进入完整构建矩阵，也会由自动 `check:matrix` 做契约校验。

## 7. Feature 生命周期和迁移

契约新增：

- `PortalFeature.lifecycle`
- `PortalProfile.featureMigrations`
- `PortalComposition.warnings`

默认 Feature 为 active。标记 deprecated 时必须声明开始版本、原因和迁移文档；可选替代 Feature 与计划删除版本。

任何 Profile 继续启用 deprecated Feature 时必须显式增加迁移确认，否则 Composer 失败。迁移确认不隐藏 warning，新 Profile 脚手架也拒绝选择 deprecated Feature。

完整流程：

- [`feature-lifecycle.md`](./feature-lifecycle.md)

该机制确保 Feature 不会在没有项目负责人、迁移目标和兼容窗口的情况下被突然删除。

## 8. Workspace package 评估

评估结论：当前不把 Kernel/Shared 提升为 workspace package。

现阶段不同项目只是同一 Portal 应用的不同 Profile，没有第二个独立应用消费方。提前抽包会增加 React/Router peer dependency、版本发布和变更协调成本，也可能把 Portal 与 Admin 的 UI 依赖重新耦合。

触发条件和候选能力详见：

- [`ADR-0004：Portal 稳定共享能力暂不提升为 workspace package`](./adr/0004-portal-shared-package-boundary.md)

未来满足两个独立消费方、API 稳定两个发布周期、无 Profile/路由/业务耦合等条件后，优先建立独立 `frontend/packages/portal-kit`，不放入 Admin 的 `@fa/ui`。

## 9. 命令

完整工程与类型检查：

```bash
pnpm --filter @fa/portal check
```

只运行 Phase 6 工程门禁：

```bash
pnpm --filter @fa/portal check:engineering
```

分项命令：

```bash
pnpm --filter @fa/portal check:boundaries
pnpm --filter @fa/portal check:profiles
pnpm --filter @fa/portal check:matrix
pnpm --filter @fa/portal check:scaffolds
pnpm --filter @fa/portal check:catalog
```

## 10. 本阶段验证记录

2026-07-23 本地结果：

| 验证项 | 结果 |
|---|---|
| 自动发现 | 8 个 Feature、2 个 Profile |
| 依赖边界 | 72 个 app 源码文件通过 |
| Profile 契约 | default、minimal、冲突和生命周期迁移用例通过 |
| Profile 矩阵 | 2 个组合通过，0 warning |
| Feature 脚手架 | 文件结构、依赖声明、拒绝覆盖通过 |
| Profile 脚手架 | 静态 import、完整依赖、缺失依赖失败通过 |
| 目录文档 | 与实际源码一致 |
| React Router typegen | 通过 |
| TypeScript | 通过 |
| default 生产构建 | 通过；14 个预渲染路径，首页初始 JS gzip 110.21 KiB |
| minimal 生产构建 | 通过；7 个预渲染路径，首页初始 JS gzip 108.35 KiB |

CI workflow 已落到仓库，但本地不能替代 GitHub Actions runner。首次推送后需要确认缓存、artifact 和两个矩阵 job 均按预期运行。

## 11. M6 验收

- 使用脚手架创建一个临时 Feature，团队评审生成结构和命名。
- 使用脚手架创建一个客户 Profile，仅修改站点信息、品牌资源和 Feature 组合。
- 在 PR 上确认 Engineering job 和两个 Profile build job 通过。
- 人为制造一次跨 Feature 深层 import，确认本地和 CI 都会失败。
- 人为标记测试 Feature deprecated，确认未确认 Profile 失败、确认后产生 warning。
- 团队接受 workspace package 暂缓决策与后续触发条件。

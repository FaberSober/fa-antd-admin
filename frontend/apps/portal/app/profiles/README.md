# Portal Profiles

Profile 是项目级静态装配入口，只能显式导入需要启用的 Feature。

```bash
PORTAL_PROFILE=default pnpm --filter @fa/portal run dev
PORTAL_PROFILE=minimal pnpm --filter @fa/portal run check
```

创建新 Profile：

```bash
pnpm --filter @fa/portal create:profile -- \
  --id customer-a \
  --name "Customer A" \
  --short-name "CA" \
  --description "Customer A 官网门户。" \
  --features fa-admin-pages,fa-ai-pages
```

脚手架会校验 Feature 是否存在、依赖是否完整、是否已经废弃，并拒绝覆盖同名文件。生成后执行：

```bash
PORTAL_PROFILE=customer-a pnpm --filter @fa/portal check
pnpm --filter @fa/portal generate:catalog
```

规则：

- 文件名和 Profile ID 使用 kebab-case。
- 禁止使用 `import.meta.glob` 扫描全部 Feature 后运行时筛选。
- Profile 只能从目标 Feature 的 `feature.ts` 公开入口导入。
- `PORTAL_PROFILE` 只参与 Vite 构建期 alias，不使用 `VITE_` 前缀。
- 未指定时使用 `default`。
- Profile 文件缺失、名称无效或契约冲突时直接失败。
- 启用 deprecated Feature 时必须通过 `featureMigrations` 显式确认，详见 [`../../docs/feature-lifecycle.md`](../../docs/feature-lifecycle.md)。
- 所有 Profile 自动进入 `check:matrix`；典型 Profile 的完整生产构建由 CI matrix 持续验证。

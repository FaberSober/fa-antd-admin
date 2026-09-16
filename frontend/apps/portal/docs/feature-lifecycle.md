# Portal Feature 生命周期与迁移

## 1. 生命周期状态

Feature 默认处于 `active`，无需声明 `lifecycle`。准备替换或移除时必须先进入 `deprecated`：

```ts
export default definePortalFeature({
  id: 'fa-portal-legacy',
  routes,
  lifecycle: {
    status: 'deprecated',
    since: '1.4.0',
    reason: '能力已合并到 fa-portal-content',
    replacementFeatureId: 'fa-portal-content',
    removalVersion: '2.0.0',
    migrationGuide: 'docs/migrations/fa-portal-legacy-to-content.md',
  },
});
```

废弃声明必须包含：

- `since`：开始废弃的 Portal 版本。
- `reason`：废弃原因。
- `migrationGuide`：可执行的迁移说明。
- `replacementFeatureId`：存在替代 Feature 时填写。
- `removalVersion`：计划移除版本；暂未确定时可以省略。

## 2. Profile 显式确认

启用 deprecated Feature 的 Profile 会直接校验失败，直到项目显式确认迁移：

```ts
export default definePortalProfile({
  id: 'customer-a',
  site,
  features: [legacyFeature, contentFeature],
  featureMigrations: [
    {
      featureId: 'fa-portal-legacy',
      acknowledgedIn: 'customer-a@1.8.0',
      targetFeatureId: 'fa-portal-content',
    },
  ],
});
```

确认项不会消除构建 warning，只表示该项目知道迁移责任。Feature 恢复 active 或从 Profile 移除后，旧的 `featureMigrations` 必须删除，否则门禁会把它识别为过期配置。

填写 `targetFeatureId` 时，目标 Feature 必须已在同一 Profile 中启用，并且必须与旧 Feature 声明的 `replacementFeatureId` 一致。

新建 Profile 的脚手架拒绝选择 deprecated Feature，避免新项目继续扩大技术债务。

## 3. 迁移顺序

1. 增加替代 Feature，并保证新旧能力可以并存。
2. 编写 `docs/migrations/<old>-to-<new>.md`，列出路由、配置、接口、内容和数据变化。
3. 将旧 Feature 标记为 deprecated，并更新目录文档。
4. 各 Profile 增加临时迁移确认，按说明切换配置和路由。
5. 从 Profile 移除旧 Feature 和迁移确认，执行工程门禁与生产构建。
6. 至少经过一个明确的兼容窗口后，在 `removalVersion` 删除旧目录。

## 4. 移除门槛

- 目录文档中没有 Profile 继续启用旧 Feature。
- 仓库中没有旧 Feature 的深层导入、路由和环境变量。
- 替代 Feature 已通过典型 Profile CI。
- 发布说明包含路由、配置和 API 的破坏性变化。
- 需要保留旧 URL 时，后端或网关重定向方案已经上线。

## 5. 迁移文档模板

```md
# <old-feature> → <new-feature>

- 开始废弃版本：
- 计划移除版本：
- 受影响 Profile：

## 路由变化
## Profile 配置变化
## API/数据变化
## 操作步骤
## 回滚方式
## 验证命令
```

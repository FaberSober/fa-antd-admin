# `<feature-id>`

一句话说明 Feature 的业务边界，不描述其他 Feature 的内部实现。

## 启用

只允许从 `feature.ts` 公开入口导入：

```ts
import exampleFeature from '../features/<feature-id>/feature';

export default definePortalProfile({
  // ...
  features: [exampleFeature],
});
```

## 公开契约

- Feature ID：`<feature-id>`
- 依赖 Feature：无；如有必须通过 `dependsOn` 声明
- 路由：
- 导航 key：
- 预渲染路径：

## 配置

列出 Profile、公开环境变量和默认值。不得记录密钥或服务端凭证。

## 接口

列出使用的 Portal API、认证要求、错误处理和超时策略。

## 依赖边界

- 可以依赖自身代码、`app/kernel` 和 `app/shared`。
- 禁止深层导入另一个 Feature。
- 跨 Feature 依赖必须通过对方 `feature.ts` 公开入口，并在 `dependsOn` 声明。
- 禁止导入 Admin 页面、Admin Feature、Admin 根级 `services`/`types`、`antd` 和 `@fa/ui`。
- 禁止在 Feature 中读取或切换 `PORTAL_PROFILE`。

## 性能

记录首屏影响、路由 Chunk、页面内部动态导入和关键资源预算。

## 验证

记录启用 Profile、关键路由、移动端场景和验证命令。

## 限制与后续

记录尚未实现的能力、兼容性限制和迁移注意事项。

## 生命周期

- 当前状态：active。
- 标记 deprecated 时必须填写 since、reason、migrationGuide，可选 replacementFeatureId 和 removalVersion。
- 启用 deprecated Feature 的 Profile 必须增加临时 `featureMigrations` 确认。
- 迁移与删除流程见 [`../feature-lifecycle.md`](../feature-lifecycle.md)。

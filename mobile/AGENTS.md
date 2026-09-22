# UniApp 移动端开发约束

## 触摸交互

- `mobile/src` 中面向用户触摸的可点击元素统一使用 `@tap`，包括 `view`、`text`、`button` 以及自定义触摸区域。
- 事件修饰符同步使用 `@tap.stop`、`@tap.prevent` 等形式；不要为普通点击交互新增 `@click`。
- `@click` 仅限 H5 专属代码或第三方组件明确要求的场景；使用时在代码旁说明原因。
- 输入框和手势事件按 UniApp 语义使用 `@input`、`@confirm`、`@touchstart`、`@touchmove`、`@touchend` 等，不要用 `@click` 替代它们。
- 组件对外的自定义事件可以继续使用语义化名称，例如 `change`、`action`、`select`；本规则约束的是组件内部实际接收触摸的元素。

## 验证要求

- 修改移动端交互后，至少执行 `pnpm --dir mobile type-check`。
- 涉及 App、H5 或微信小程序兼容性的改动，执行对应构建并在目标端验证点击和滚动行为。
- 修改已有组件时，顺手将本次涉及的普通 `@click` 迁移为 `@tap`，不做无关页面重构。

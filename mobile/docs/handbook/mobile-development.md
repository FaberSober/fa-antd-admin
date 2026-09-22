# 移动端开发规范

## 触摸事件

移动端页面运行在 UniApp 的 H5、App 和微信小程序环境中。普通的用户点击交互统一使用 `@tap`，避免不同端对 Web `click` 合成、滚动和原生层级处理不一致。

正确示例：

```vue
<view class="feature-card" @tap="openFeature">
  <text>功能入口</text>
</view>

<view class="mask" @tap="close">
  <view class="sheet" @tap.stop>
    <!-- 点击面板内容不会关闭遮罩 -->
  </view>
</view>
```

不要新增：

```vue
<view @click="openFeature">功能入口</view>
```

以下事件不属于普通点击，不需要改成 `@tap`：

- 输入框：`@input`、`@confirm`、`@focus`、`@blur`
- 手势：`@touchstart`、`@touchmove`、`@touchend`
- 组件自定义事件：`@change`、`@action`、`@select`

如果 H5 专属逻辑或第三方组件必须使用 `@click`，需要在代码旁注明原因，并确认 App 和微信小程序不会执行该分支。

## 修改后的检查

至少执行：

```bash
pnpm --dir mobile type-check
```

涉及跨端交互时，再执行对应构建并在真机或开发者工具验证：

```bash
pnpm --dir mobile build:app
pnpm --dir mobile build:h5
pnpm --dir mobile build:mp-weixin
```

# ADR：mobile 主题模块

- 状态：🟡进行中
- 日期：2026-09-21
- 范围：`mobile`、`fa-core-mobile/theme`、`fa-base-mobile` 外观设置
- 关联：`ADR-mobile-002-ui-app-shell.md`、`ADR-mobile-004-mine-feature.md`
- 当前进度：已完成主题根节点、主题状态初始化、暗色 Token、正式页面适配和系统导航栏同步，等待三端主题回归验证；其余主题功能待开发

## 背景

`mobile` 当前只有亮色 CSS Token，`外观设置`页面仍是占位内容，部分页面和 `pages.json` 还直接使用亮色值。需要补充统一的浅色/深色主题能力，并保证 H5、App、微信小程序行为一致。

## 目标

- 支持浅色和深色两种主题。
- 主题切换立即生效，并使用 `uni.setStorageSync` 持久化。
- 复用现有 CSS Token，不引入新的 UI 组件库或后端接口。
- 统一处理页面背景、卡片、文本、边框、状态色和系统导航栏。
- 保持现有 `MobileShell`、页面结构、租户和登录逻辑不变。

## 范围边界

- 第一阶段只实现浅色、深色，不实现跟随系统。
- 不实现主色自定义、布局切换、字体大小和主题导入导出。
- 不新增后端接口、数据库字段或独立 `fa-theme-mobile` Feature。
- Demo 页面不新增专门主题逻辑，公共组件和页面根节点按统一主题能力接入即可。

## 功能清单

| 模块 | 功能 | 功能详情 | 当前规划 | 进度 |
|---|---|---|---|---|
| `fa-core-mobile/theme` | 跨端主题挂载验证 | 确认页面根节点 CSS 变量在 H5、App、小程序可继承 | 执行开发 | ✅已完成 |
| `fa-core-mobile/theme` | 主题状态与持久化 | 支持 `light/dark`，使用 `fa.mobile.theme-mode` 本地保存 | 执行开发 | ✅已完成 |
| `fa-core-mobile/theme` | 主题根组件 | 统一提供主题 class、背景和 CSS 变量作用域 | 执行开发 | ✅已完成 |
| `mobile` 全局样式 | 亮色/暗色 Token | 补充页面、卡片、文本、边框和状态色 Token | 执行开发 | ✅已完成 |
| `fa-base-mobile` 公共页面 | 正式页面主题适配 | 接入 Shell 和独立页面，清理主题相关硬编码颜色 | 执行开发 | 🔍验证中 |
| `fa-base-mobile` 外观设置 | 浅色/深色切换 | 外观页显示当前主题，点击后立即生效 | 执行开发 | 🕒待处理 |
| `mobile` 导航栏 | 系统导航栏同步 | 初始化、切换和页面显示时同步导航栏颜色 | 执行开发 | ✅已完成 |
| `mobile` 跨端验证 | 构建与人工验证 | 类型检查、H5/小程序构建、重启恢复和宽度验证 | 执行开发 | 🕒待处理 |
| `mobile` 主题扩展 | 跟随系统与自定义主题 | 增加系统模式、主色和布局个性化 | 留作未来版本规划 | 👀待确认 |

## 决策

### 1. Core 与 Base 分层

- 在 `fa-core-mobile/theme` 中维护主题状态、持久化和导航栏同步。
- 在宿主 `mobile/src/styles/global.css` 中维护运行时 CSS Token。
- `fa-base-mobile` 只负责“我的 → 外观设置”页面和页面接入。
- 不在每个页面单独维护 `isDark` 或颜色常量。

### 2. 主题状态与持久化

- 使用 `ThemeMode = 'light' | 'dark'`。
- 存储 Key 使用 `fa.mobile.theme-mode`。
- 缺少或非法值默认使用浅色。
- 应用启动时同步恢复主题，切换主题时立即保存。
- 不使用 `document`、`localStorage` 等 H5 专属 API。

### 3. 页面主题作用域

- 新增 `MobileThemeRoot.vue`，通过主题 class 为页面提供 CSS 变量作用域。
- `MobileShell` 统一接入主题根节点，覆盖四个主 Tab 页面。
- 登录、个人资料、账号安全、外观、关于和文件预览等独立页面也接入主题根节点。
- 优先使用页面根节点继承 CSS 变量，避免跨端 DOM 操作。

### 4. CSS Token

- 保留现有 `--fa-*` 命名，补充暗色语义值。
- 重点覆盖页面背景、卡片背景、文本、次级文本、边框、主色弱背景、状态色、遮罩和阴影。
- `uni.scss` 只作为编译期默认值，不承担运行时主题切换。
- 仅替换会影响主题的硬编码颜色；按钮反色文本等稳定颜色无需机械替换。

### 5. 系统导航栏

- 通过 `uni.setNavigationBarColor` 同步默认导航栏的背景色和文字前景色。
- 应用初始化、主题切换和页面重新显示时执行同步。
- `pages.json` 中的浅色值保留为静态默认值，自定义导航栏页面由 CSS Token 控制。

## 开发说明

### 1. 主题核心能力

- 新增 `fa-core-mobile/theme/index.ts`。
- 提供当前主题、主题初始化、主题切换和导航栏同步方法。
- 在 `main.ts` 注册 Pinia 后尽早恢复主题，减少首屏闪烁。

### 2. 主题根组件

- 新增 `fa-core-mobile/theme/MobileThemeRoot.vue`。
- 根据当前主题添加 `mobile-theme-root--light` 或 `mobile-theme-root--dark`。
- 保证根节点覆盖页面高度，并继承页面背景和文字颜色。

### 3. 亮色与暗色 Token

- 修改 `mobile/src/styles/global.css`。
- 以当前亮色 Token 为基准补充暗色 Token。
- 检查 hover、disabled、border、错误态、空态和遮罩的对比度。

### 4. 正式页面适配

- 修改 `MobileShell`，使四个主页面自动获得主题。
- 为非 Shell 页面补充主题根节点。
- 清理 Header、TabBar、租户切换、登录、资料、账号安全和文件预览中的主题相关硬编码颜色。

### 5. 外观设置页面

- 将 `pages/mine/appearance/index.vue` 从占位页改为浅色/深色选项页。
- 显示当前选中状态，点击后立即切换并持久化。
- 不新增保存按钮或额外主题配置项。

## 实施顺序

1. 验证 H5、App、微信小程序页面根节点的 CSS 变量继承方式。
2. 新增主题状态、持久化和导航栏同步能力。
3. 新增主题根组件并接入 `MobileShell` 和独立页面。
4. 补充暗色 CSS Token，替换正式页面的主题相关硬编码颜色。
5. 完成外观设置页面。
6. 执行类型检查、构建检查和跨端主题验证。

## 文件调整范围

### 新增

- `mobile/src/features/fa-core-mobile/theme/index.ts`
- `mobile/src/features/fa-core-mobile/theme/MobileThemeRoot.vue`

### 修改

- `mobile/src/main.ts`
- `mobile/src/styles/global.css`
- `mobile/src/uni.scss`（仅在编译期默认值需要同步时修改）
- `mobile/src/features/fa-base-mobile/components/MobileShell.vue`
- `mobile/src/features/fa-base-mobile/pages/mine/appearance/index.vue`
- 其他存在主题相关硬编码颜色的正式页面和公共组件

## 验收标准

- 浅色和深色可以在外观设置页切换，并立即作用于当前页面。
- App 重启后保留上次选择的主题。
- 登录、四个主 Tab、个人资料、账号安全、外观、关于和文件预览页面均无明显亮色残留。
- 默认导航栏页面的背景色和文字颜色随主题同步。
- 页面在约 320–430 CSS 像素宽度下无横向溢出。
- H5、微信小程序构建通过，`pnpm --dir mobile type-check` 通过。
- 主题切换不影响登录、租户切换、消息角标和页面路由。

## 验证与状态更新

- 开发完成后将本文状态更新为 `🔍验证中`。
- 人工确认 H5、App、微信小程序验证通过后，再更新为 `✅已完成`。
- 验证失败时保留 `🔍验证中`，不提前标记完成。

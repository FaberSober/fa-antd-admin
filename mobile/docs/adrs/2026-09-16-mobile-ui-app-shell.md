# ADR：mobile 应用壳与四 Tab UI 视觉优化

- 状态：🟡进行中
- 日期：2026-09-16
- 范围：`mobile` Uni-app、`fa-base-mobile`
- 当前进度：已完成实施顺序 1–7；四个主页面和租户抽屉已补齐加载、空态、错误、重试、未读及退出确认状态，真实接口接入和跨端视觉验证待继续开发。

## 背景

v0.app 设计包含消息、工作台、联系人、我的四个主页面，以及顶部租户入口和租户切换底部抽屉。当前 mobile 仍是 MVP 基础壳，只有登录、空白首页、用户信息和基础租户切换，页面结构与设计稿不一致。

本次目标是把设计图提炼为可复用的移动端应用壳和基础组件。截图中的示例文案、租户名称和联系人仅作为视觉参考，真实数据仍使用现有登录、用户和租户状态；消息、联系人接口未确定时不得自行假设后端接口。

## 设计资料

以下图片是 v0.app 导出的视觉基准，仅用于开发和验收，不加入运行时资源：

| 文件 | 页面 |
|---|---|
| [`01-messages.png`](../design/mobile-ui/01-messages.png) | 消息 |
| [`02-tenant-switcher.png`](../design/mobile-ui/02-tenant-switcher.png) | 租户切换 |
| [`03-workbench.png`](../design/mobile-ui/03-workbench.png) | 工作台 |
| [`04-contacts.png`](../design/mobile-ui/04-contacts.png) | 联系人 |
| [`05-mine.png`](../design/mobile-ui/05-mine.png) | 我的 |

实现时以图片的布局、视觉层级、间距和状态为参考；图片中的示例数据不得直接硬编码到业务逻辑中。

## 目标与范围

- 建立统一的顶部区域、页面容器、底部四 Tab 导航和安全区处理。
- 完成消息、工作台、联系人、我的四个页面的视觉结构和基础交互。
- 优化租户入口和租户切换底部抽屉，保留现有租户 Store、请求头和按用户持久化逻辑。
- 统一颜色、字体、间距、圆角、边框、图标和页面状态。
- 消息、联系人真实接口适配和实时未读数不作为本期视觉改造的前置条件。
- 本期不新增后端模块、数据库表或 DDL。

## 决策

### 1. 采用自定义 Mobile App Shell

- 新增 `MobileShell.vue`，统一承载页面背景、顶部区域、内容滚动和底部安全区。
- 新增 `MobileHeader.vue`，左侧显示当前租户、角色和切换入口，右侧显示页面标题和通知入口。
- 新增 `MobileTabBar.vue`，提供消息、工作台、联系人、我的四个入口，支持当前态和未读角标。
- 使用自定义 Tab Bar，不使用 uni-app 原生 `tabBar`，保证 H5、App、微信小程序的视觉一致性。
- Demo 页面继续保留独立路由，但不放入正式四 Tab 页面内容。

### 2. 建立轻量视觉 Token

- 页面背景使用浅灰蓝，内容区域使用白色卡片。
- 主色使用蓝色，橙色、紫色、绿色分别表达待办、组织和通知等语义。
- 卡片优先使用浅边框和轻阴影，避免大面积强阴影。
- 页面左右边距统一为 `32rpx`，常用卡片内边距为 `32rpx`，主要点击区域不小于 `88rpx`。
- 所有页面和抽屉都处理 `safe-area-inset-top`、`safe-area-inset-bottom`。

### 3. 页面与路由

- 保留 `pages/home/index.vue` 作为工作台页面。
- 新增 `pages/messages/index.vue`、`pages/contacts/index.vue`、`pages/mine/index.vue`。
- 在 `pages.json` 和 `fa-base-mobile/feature.ts` 中注册新页面。
- Tab 跳转统一使用集中定义的页面路径，避免各页面重复拼接 URL。

### 4. 数据与状态

- 用户、当前租户和租户切换继续复用现有 `auth`、`tenant` Store。
- 常用功能使用本地配置驱动，避免把卡片结构写死在模板中。
- 消息和联系人页面先完成类型化的展示模型、加载态、空态和错误态；真实接口未确定时使用开发期示例数据或正式空态。
- `TenantWorkspace.unreadCount` 作为未读数展示字段保留，跨租户未读数接口按现有多租户 ADR 后续接入。
- 页面不得硬编码当前用户、租户名称、角色或联系人数据。

## 文件调整范围

### 修改

- `mobile/src/styles/global.css`
- `mobile/src/uni.scss`
- `mobile/src/pages.json`
- `mobile/src/features/fa-base-mobile/feature.ts`
- `mobile/src/features/fa-base-mobile/pages/home/index.vue`
- `mobile/src/features/fa-base-mobile/components/TenantWorkspaceSwitcher.vue`

### 新增

- `mobile/src/features/fa-base-mobile/components/MobileShell.vue`
- `mobile/src/features/fa-base-mobile/components/MobileHeader.vue`
- `mobile/src/features/fa-base-mobile/components/MobileTabBar.vue`
- `mobile/src/features/fa-base-mobile/components/MobileSearchField.vue`
- `mobile/src/features/fa-base-mobile/components/MobileSectionHeader.vue`
- `mobile/src/features/fa-base-mobile/components/MobileEmptyState.vue`
- `mobile/src/features/fa-base-mobile/components/MobileIcon.vue`
- `mobile/src/features/fa-base-mobile/pages/messages/index.vue`
- `mobile/src/features/fa-base-mobile/pages/contacts/index.vue`
- `mobile/src/features/fa-base-mobile/pages/mine/index.vue`
- `mobile/src/features/fa-base-mobile/types/mobileIcon.ts`

## 功能开发说明

### 1. 全局样式与基础组件

- 在 `global.css` 和 `uni.scss` 中补充颜色、文字、间距、圆角、边框和安全区 Token。
- 将现有通用卡片调整为浅边框、轻阴影和统一圆角。
- 封装本地可跨端使用的线性图标组件，不新增第三方 UI 组件库依赖。
- 统一搜索框、区块标题、空状态、箭头和点击反馈样式。

### 2. 顶部区域与底部导航

- 工作台顶部不显示页面标题；消息、联系人、我的显示对应标题。
- 租户信息展示租户名称、用户角色和切换箭头，内容来自 Store。
- 通知入口统一放在右上角，支持红点或未读数量。
- 底部导航固定在安全区上方，内容区域预留导航高度，避免遮挡最后一条数据。

### 3. 工作台页面

- 增加动态问候语、用户角色和“开始今天的工作吧”主标题。
- 增加功能搜索框。
- 使用 2×2 网格展示待办事项、最近使用、系统公告、帮助中心。
- 增加业务模块区，无模块时显示统一空状态。
- 用户详细资料从工作台移到我的页面。

### 4. 消息页面

- 增加“全部 / 未读”筛选 Tab。
- 消息行包含类型图标、标题、摘要、分类、时间和未读圆点。
- 未读消息使用浅蓝色背景，已读消息使用普通页面背景。
- 支持列表加载、空列表、搜索无结果、请求失败和重试。
- Tab Bar 的消息入口展示总未读角标。

### 5. 联系人页面

- 增加联系人和部门搜索框。
- 使用组合卡片展示“组织架构”和“我的联系人”两个入口。
- 使用头像、姓名、职位或部门展示最近联系人。
- 长文本使用省略号，列表项保留右侧箭头和足够点击区域。
- 无联系人或搜索无结果时使用统一空状态。

### 6. 我的页面

- 使用资料卡展示头像、姓名、账号和当前租户。
- 使用组合列表展示账号与安全、通知设置、外观设置、关于 Fa Mobile。
- 退出登录使用危险色，并增加二次确认。
- 继续复用现有退出登录逻辑，退出后清理 Token、用户和租户上下文。

### 7. 租户切换底部抽屉

- 保留现有租户切换、权限校验、按用户保存和 `fa-tn-tenant-id` 请求头逻辑。
- 将当前租户入口移动到顶部 Header。
- 租户数量较少，抽屉不提供搜索和最近使用区域，直接按租户名称排序展示全部租户，并隐藏原生滚动条。
- 当前租户显示蓝色选中标识，各租户支持未读角标。
- 增加“加入其他租户”入口作为后续动作占位。
- 处理加载中、暂无租户、接口失败、重试和切换中状态。
- 切换租户后继续使用页面重载或等价方式清理旧租户页面状态，不自动退出登录。

## 状态、可用性与错误处理

- 首屏加载使用 Skeleton 或明确的加载状态，避免出现空白页面。
- 接口失败显示非阻塞错误提示和重试入口；租户加载失败不直接清除登录态。
- 搜索无结果、无租户、无消息、无联系人和未配置业务模块使用统一空状态。
- H5 页面保留可见焦点态，主要操作区域不小于约 `44px × 44px`。
- 检查文字与背景对比度、长租户名、长联系人姓名和窄屏布局。
- 消息、联系人和租户列表的最后一项不能被底部导航遮挡。

## 实施顺序

1. ✅ 更新全局 Token 和基础卡片样式。
2. ✅ 新增 `MobileShell`、`MobileHeader`、`MobileTabBar` 及通用展示组件。
3. ✅ 注册四个主页面路由，完成统一页面壳接入。
4. ✅ 重构租户顶部入口和底部切换抽屉。
5. ✅ 将现有工作台首页改造成设计稿中的工作台。
6. ✅ 新增消息、联系人和我的页面。
7. ✅ 补齐加载、空态、错误、重试、未读和退出确认状态。
8. 🕒 在接口明确后接入消息、联系人和跨租户未读数。
9. 🕒 运行类型检查并进行 H5、App、微信小程序的安全区和交互验证。

## 验收标准

- 四个主页面共享同一套顶部区域和底部 Tab 导航。
- 页面在约 320–430 CSS 像素宽度下无横向溢出。
- 颜色、字体层级、间距、卡片、图标和底部导航符合设计基线。
- 当前 Tab、租户选中态、消息未读态和通知角标清晰可见。
- 租户抽屉支持打开、关闭、选中、失败重试和无数据展示。
- 用户、租户和角色信息来自现有 Store，不使用设计图中的固定示例数据。
- 消息、联系人尚无真实接口时，页面仍能正确展示加载、空态和错误态。
- H5、App、微信小程序均能正确处理顶部和底部安全区。
- `pnpm --dir mobile type-check` 通过。
- 本期不新增数据库表、DDL 或后端模块。

## 后果

### 正面

- 四个页面共享布局和视觉 Token，减少重复 CSS。
- 自定义 Tab Bar 能保持多端视觉一致，并支持消息角标。
- 现有登录、租户上下文和请求逻辑可以继续复用。
- 后续业务模块可以直接挂载到工作台和统一页面壳中。

### 负面

- 自定义页面壳和 Tab Bar 需要自行处理安全区、跳转和页面状态。
- 消息、联系人真实接口未确定前，需要保留类型化示例数据或空态适配层。
- 本地跨端图标组件需要进行 H5、App、微信小程序兼容验证。

## 备选方案

- **只修改现有首页样式**：改动少，但无法覆盖四个设计页面，也会造成页面结构重复，放弃。
- **使用 uni-app 原生 `tabBar`**：平台能力简单，但不同端样式和角标能力不一致，无法稳定还原设计，放弃。
- **引入第三方移动端 UI 组件库**：可以减少基础控件开发，但会增加依赖和样式覆盖成本，本期不采用。

## 参考

- `mobile/docs/plans/2026-09-15-mobile-mvp-plan.md`
- `mobile/docs/adrs/2026-09-16-mobile-multi-tenant-switch.md`
- `mobile/docs/design/mobile-ui/`
- `mobile/src/styles/global.css`
- `mobile/src/features/fa-base-mobile/pages/home/index.vue`

## 功能清单

| 模块 | 功能 | 功能详情 | 当前规划 | 进度 |
|---|---|---|---|---|
| `fa-base-mobile` 基础能力 | 复用登录、用户和租户状态 | 保留现有 Store、Token 和租户请求上下文 | 执行开发 | ✅已完成 |
| `mobile UI` | 全局视觉 Token | 统一颜色、字体、间距、圆角、边框和安全区 | 执行开发 | ✅已完成 |
| `mobile UI` | Mobile App Shell | 统一页面背景、Header、滚动区域和底部安全区 | 执行开发 | ✅已完成 |
| `mobile UI` | 顶部 Header | 展示租户、角色、页面标题和通知入口 | 执行开发 | ✅已完成 |
| `mobile UI` | 底部四 Tab 导航 | 消息、工作台、联系人、我的，支持当前态和角标 | 执行开发 | ✅已完成 |
| `mobile UI` | 通用基础组件 | 搜索框、区块标题、图标、空状态和列表反馈 | 执行开发 | ✅已完成 |
| `fa-base-mobile` 租户 | 租户入口视觉改造 | 将租户入口接入 Header，复用现有租户状态 | 执行开发 | ✅已完成 |
| `fa-base-mobile` 租户 | 租户切换底部抽屉 | 按租户名称排序展示全部租户、选中态、未读角标和加入入口 | 执行开发 | ✅已完成 |
| `fa-base-mobile` 页面 | 工作台页面 | 欢迎语、功能搜索、常用功能和业务模块空态 | 执行开发 | ✅已完成 |
| `fa-base-mobile` 页面 | 消息页面 | 全部/未读筛选、消息列表、未读态和空态 | 执行开发 | ✅已完成 |
| `fa-base-mobile` 页面 | 联系人页面 | 组织入口、我的联系人和最近联系人 | 执行开发 | ✅已完成 |
| `fa-base-mobile` 页面 | 我的页面 | 用户资料、工作空间设置和退出登录 | 执行开发 | ✅已完成 |
| `fa-base-mobile` 交互 | 加载、空态和错误态 | 明确加载状态、无数据、失败重试和搜索无结果 | 执行开发 | ✅已完成 |
| `fa-base-mobile` 交互 | 退出登录确认 | 二次确认并清理登录和租户上下文 | 执行开发 | ✅已完成 |
| `fa-base-mobile` 数据 | 消息真实接口适配 | 根据已确认的消息 API 接入列表和已读操作 | 留作未来版本规划 | 👀待确认 |
| `fa-base-mobile` 数据 | 联系人真实接口适配 | 根据已确认的组织和联系人 API 接入真实数据 | 留作未来版本规划 | 👀待确认 |
| `fa-im` / `fa-base-mobile` | 跨租户未读数接入 | 使用聚合接口更新 Tab 和租户角标 | 留作未来版本规划 | 👀待确认 |
| `mobile` 验证 | 跨端视觉与安全区验证 | 验证 H5、App、微信小程序的布局和交互 | 执行开发 | 🕒待处理 |

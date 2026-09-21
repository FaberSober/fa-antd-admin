# ADR：mobile “我的”模块功能开发与体验优化

- 状态：🟡进行中
- 日期：2026-09-21
- 范围：`mobile`、`fa-base-mobile`、必要的 `fa-base Portal` 接口
- 当前进度：设置入口与路由、个人资料查看、个人资料编辑、修改密码、退出登录状态同步、真实消息列表、已读与未读数均已完成验证；其他功能待开发

## 背景

当前“我的”页已经完成基础视觉结构，但资料卡和设置项仍是占位交互。登录、用户查询、租户切换和退出登录能力已经存在；个人资料更新、密码修改、真实消息数据和外观设置尚未接入。

截图和设计稿只作为布局、层级和交互反馈参考，不直接使用其中的示例用户、租户或消息数据。

## 目标与范围

- 将“我的”页改造成真实的个人资料、账号安全和应用设置入口。
- 接入已有用户和消息接口，避免重复建设后端能力。
- 保持现有 `MobileShell`、租户上下文、底部 Tab 和安全区处理。
- 第一阶段不新增数据库表；外观设置使用本地存储。
- 推送通知偏好暂不实现，等待后端和平台推送契约明确。

## 决策

### 1. 页面结构

- 资料卡进入个人资料页。
- “账号与安全”进入账号安全页，第一版包含修改密码。
- “通知设置”第一版建议改名为“消息中心”，进入现有消息页。
- “外观设置”进入本地外观设置页。
- “关于 Fa Mobile”进入版本信息页。
- 租户切换继续使用顶部 Header，不在“我的”页重复实现。
- 设置分组标题由“工作空间”改为“设置”，或拆分为“账号”和“应用设置”。

建议新增页面：

```text
features/fa-base-mobile/pages/mine/account/index
features/fa-base-mobile/pages/mine/security/index
features/fa-base-mobile/pages/mine/appearance/index
features/fa-base-mobile/pages/mine/about/index
```

### 2. 个人资料与账号安全

- 资料页展示头像、姓名、账号、手机号、邮箱、账号状态和当前租户。
- 第一版支持修改头像、姓名、手机号和邮箱；账号只读。
- 头像上传复用现有 `uploadBaseFile`，保存用户字段时映射为后端 `img` 字段。
- 修改资料优先复用现有 `POST /api/base/admin/user/updateMine`。
- 开发前确认该接口允许 Portal 移动端 Token 调用；若不允许，新增 Portal 域薄接口，不让移动端直接依赖后台权限接口。
- 修改密码复用 `POST /api/base/admin/user/updateMyPwd`，成功后清理会话并返回登录页。
- 不在移动端保存密码，不在 telemetry 或错误日志中记录密码字段。

### 3. 消息中心与未读数

- 消息页移除生产环境 fixture，接入真实接口。
- 使用现有 `pageMine`、`countMine`、`batchRead`、`readAll` 接口。
- 默认按创建时间倒序，每页 20 条；支持全部/未读筛选、刷新、加载失败重试和空状态。
- 单条或全部已读成功后重新获取未读统计，保持 Header、Tab Bar 和消息页一致。
- 消息内容按纯文本展示，不渲染未知 HTML，也不根据未知业务字段自动跳转。
- 当前选中租户的消息请求继续依赖统一的 `fa-tn-tenant-id` 请求头。
- 各租户独立未读数和实时角标沿用多租户 ADR，待聚合接口明确后再接入，不先伪造数据。

### 4. 外观与关于

- 外观第一版只实现浅色、深色；是否跟随系统可后续补充。
- 外观选项使用 `uni.setStorageSync` 持久化，不新增后端接口。
- 通过现有 CSS 变量扩展暗色主题，保持现有组件和页面结构。
- 关于页展示应用名称、版本名称和版本编码，信息来自 `APP_CONFIG`。
- 不在第一版加入主色自定义、布局切换、反馈中心等未确认功能。

### 5. 通知设置边界

当前没有明确的通知偏好接口、推送设备注册流程和跨平台推送协议，因此第一阶段不实现推送开关。

后续需要确认：

- 站内消息、系统推送和业务通知的分类。
- 通知偏好是否按用户或租户隔离。
- Android、iOS、微信小程序的设备注册和权限处理。
- 后端通知偏好存储及同步接口。

## 现有接口

### 用户

- `GET /api/portal/account/me`
- `POST /api/base/admin/user/updateMine`
- `POST /api/base/admin/user/updateMyPwd`
- `GET /api/portal/auth/logout`

### 消息

- `POST /api/base/admin/msg/pageMine`
- `GET /api/base/admin/msg/countMine`
- `POST /api/base/admin/msg/batchRead`
- `GET /api/base/admin/msg/readAll`

消息请求结构和字段以 `frontend/apps/h5/docs/m0/pilot-message-center.md` 为准。移动端消息 ID 使用后端真实的 `number` 类型，不复制 Admin 端的字符串类型漂移。

## 文件调整范围

预计修改：

- `mobile/src/features/fa-base-mobile/pages/mine/index.vue`
- `mobile/src/features/fa-base-mobile/feature.ts`
- `mobile/src/pages.json`
- `mobile/src/features/fa-base-mobile/stores/auth.ts`
- `mobile/src/features/fa-base-mobile/stores/message.ts`
- `mobile/src/styles/global.css`

预计新增：

- `mobile/src/features/fa-base-mobile/api/account.ts`
- `mobile/src/features/fa-base-mobile/api/message.ts`
- `mobile/src/features/fa-base-mobile/types/message.ts`
- `mobile/src/features/fa-base-mobile/pages/mine/account/index.vue`
- `mobile/src/features/fa-base-mobile/pages/mine/security/index.vue`
- `mobile/src/features/fa-base-mobile/pages/mine/appearance/index.vue`
- `mobile/src/features/fa-base-mobile/pages/mine/about/index.vue`

不新增独立 `mineStore`；资料继续复用 `authStore`，消息继续复用 `messageStore`。

## 实施顺序

1. 注册“我的”子页面路由，替换当前占位点击行为。
2. 实现个人资料查看、编辑和资料保存后的状态同步。
3. 实现修改密码、成功退出和失败重试。
4. 接入真实消息列表、未读统计和已读操作。
5. 实现外观设置并验证重新打开 App 后仍生效。
6. 实现关于页面。
7. 完成接口鉴权、租户切换、错误状态和跨端验证。

## 验收标准

- “我的”页不再对已纳入第一阶段的功能显示“即将开放”。
- 资料卡、账号安全、消息中心、外观和关于页面均可正常进入和返回。
- 资料保存成功后返回页面能显示最新信息；保存失败保留表单内容并可重试。
- 修改密码成功后会清理登录态并进入登录页。
- 生产环境消息数据来自真实接口，不依赖 fixture。
- 消息已读操作后 Header、底部 Tab 和消息页未读数同步。
- 当前租户切换后不会继续展示旧租户消息或角标。
- 外观选择在 App 重启后保持，页面在亮色和暗色下无明显对比度问题。
- 页面在约 320–430 CSS 像素宽度下无横向溢出，底部内容不被 Tab Bar 遮挡。
- `pnpm --dir mobile type-check` 通过。

## 非目标

- 不新增个人中心后端业务模块或数据库表。
- 不实现好友、联系人和组织通讯录功能。
- 不实现 WebSocket 实时推送和厂商推送。
- 不实现通知偏好开关，直到后端接口和平台方案确认。
- 不顺带重构现有 Mobile Shell、租户切换和全局主题架构。

## 参考

- `mobile/src/features/fa-base-mobile/pages/mine/index.vue`
- `mobile/src/features/fa-base-mobile/stores/auth.ts`
- `mobile/src/features/fa-base-mobile/stores/tenant.ts`
- `mobile/src/features/fa-base-mobile/pages/messages/index.vue`
- `mobile/docs/adrs/ADR-mobile-001-multi-tenant-switch.md`
- `mobile/docs/adrs/ADR-mobile-002-ui-app-shell.md`
- `frontend/apps/h5/docs/m0/pilot-message-center.md`
- `fa-base/src/main/java/com/faber/api/portal/auth/rest/PortalAccountController.java`
- `fa-base/src/main/java/com/faber/api/base/admin/rest/UserController.java`
- `fa-base/src/main/java/com/faber/api/base/msg/rest/MsgController.java`

## 功能清单

| 模块 | 功能 | 功能详情 | 当前规划 | 进度 |
|---|---|---|---|---|
| `fa-base-mobile` 页面入口 | 设置入口与路由 | 资料卡、账号安全、消息中心、外观、关于均可进入 | 执行开发 | ✅已完成 |
| `fa-base-mobile` 账户 | 个人资料查看 | 展示用户、账号、联系方式、状态和当前租户 | 执行开发 | ✅已完成 |
| `fa-base-mobile` 账户 | 个人资料编辑 | 修改头像、姓名、手机号和邮箱，保存后同步 Store | 执行开发 | ✅已完成 |
| `fa-base-mobile` 账户 | 修改密码 | 校验表单并调用现有接口，成功后重新登录 | 执行开发 | ✅已完成 |
| `fa-base-mobile` 认证 | 退出登录状态同步 | 清理 Token、用户和租户上下文，避免重复提交 | 执行开发 | ✅已完成 |
| `fa-base-mobile` 消息 | 真实消息列表 | 接入分页、全部/未读筛选、刷新、空态和错误重试 | 执行开发 | ✅已完成 |
| `fa-base-mobile` 消息 | 已读与未读数 | 支持单条/全部已读，同步 Header 和 Tab Bar 角标 | 执行开发 | ✅已完成 |
| `fa-base-mobile` 租户 | 租户维度未读角标 | 接入聚合接口后展示各租户独立未读数 | 执行开发 | 👀待确认 |
| `fa-base-mobile` 外观 | 亮色/暗色设置 | 本地持久化主题并复用现有 CSS Token | 执行开发 | 🕒待处理 |
| `fa-base-mobile` 关于 | 应用版本信息 | 展示应用名称、版本名称和版本编码 | 执行开发 | 🕒待处理 |
| `fa-base-mobile` 通知 | 推送通知偏好 | 需要通知分类、设备注册和后端偏好接口 | 留作未来版本规划 | 👀待确认 |

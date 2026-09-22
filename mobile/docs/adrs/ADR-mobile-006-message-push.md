# ADR：mobile 消息推送模块

- 状态：🟡进行中
- 日期：2026-09-21
- 范围：`fa-base`、`mobile`、`fa-base-mobile`、`fa-core-mobile`
- 关联：`ADR-mobile-001-multi-tenant-switch.md`、`ADR-mobile-004-mine-feature.md`

## 功能清单

| 编号 | 模块 | 功能 | 功能详情 | 当前规划 | 进度 |
|---:|---|---|---|---|---|
| 1 | 推送基础配置 | UniPush 2.0 App 配置 | 配置 Android/iOS App 推送能力、权限和环境信息 | 执行开发 | ✅已完成 |
| 2 | `fa-base` 推送设备 | 推送设备绑定表 | 保存用户、平台、App、环境和 Push Client ID 的绑定关系 | 执行开发 | ✅已完成 |
| 3 | `fa-base` Portal | 设备注册与注销接口 | 登录后注册设备，退出登录时注销设备，接口必须幂等 | 执行开发 | 🕒待处理 |
| 4 | `fa-base` Push | UniPush 服务端发送 | 使用服务端密钥向用户的有效设备发送系统通知 | 执行开发 | 🕒待处理 |
| 5 | `fa-base` 消息 | 接入 `MsgHelper` | 先保存 `base_msg`，事务提交后异步发送推送和 WebSocket | 执行开发 | 🕒待处理 |
| 6 | 后台公告 | 复用公告发送入口 | 创建公告后沿用现有 `NoticeBiz` 给用户生成消息并推送 | 执行开发 | 🕒待处理 |
| 7 | `fa-core-mobile` | App 推送监听 | 在 App 启动时监听前台接收和系统通知点击事件 | 执行开发 | 🕒待处理 |
| 8 | `fa-base-mobile` | 登录态绑定设备 | 登录、恢复登录、CID 变化时注册；退出时注销 | 执行开发 | 🕒待处理 |
| 9 | `fa-base-mobile` | 消息同步与点击跳转 | 收到推送刷新未读数，点击通知进入消息中心 | 执行开发 | 🕒待处理 |
| 10 | 推送稳定性 | 失败和失效设备处理 | 推送失败不影响站内消息；失效 CID 停止重复发送 | 执行开发 | 🕒待处理 |
| 11 | 跨端验证 | Android/iOS 真机验证 | 验证前台、后台、杀进程、点击通知和多设备场景 | 执行开发 | 🕒待处理 |

## 背景与目标

当前 mobile 已有站内消息列表、未读数和已读接口，后台公告保存后也会通过 `MsgHelper` 创建 `base_msg`。但 App 尚未注册推送设备，`sendAppPush` 也尚未接入实际推送服务。

目标：

- 后台创建公告后，用户的 Android/iOS App 可以收到系统通知。
- App 前台收到通知时更新未读数和消息列表。
- App 在后台或被关闭时，点击系统通知可以进入消息中心。
- 推送失败时不影响 `base_msg` 保存和站内消息查看。

## 决策

### 1. 使用 UniPush 2.0

- App 端使用 `uni.getPushClientId` 获取 CID。
- App 端使用 `uni.onPushMessage` 监听 `receive` 和 `click` 事件。
- 服务端通过 UniPush 服务端接口发送通知。
- Android/iOS 离线推送需要在 `manifest.json` 和 DCloud 打包配置中启用。
- H5 和微信小程序不纳入本期原生系统推送范围。

参考：[UniPush 客户端 API](https://uniapp.dcloud.net.cn/api/plugins/push)、[UniPush 2.0](https://uniapp.dcloud.net.cn/unipush-v2)。

### 2. 复用现有消息和公告能力

- `base_msg` 是站内消息的唯一事实源，不新增第二套消息表。
- 后台继续使用现有公告页面作为全员发送入口。
- 业务代码统一调用 `MsgHelper`，不直接插入 `base_msg` 后绕过推送。
- `sendAppPush` 控制是否发送 App 推送。
- 短信验证码不发送系统通知，避免敏感内容出现在锁屏通知中。

### 3. 新增独立推送设备绑定表

不复用 `base_user_device.device_id`。现有用户设备表用于访问审批，Push CID 是推送服务标识，二者生命周期和安全语义不同。

建议新增 `base_push_device`，字段至少包括：

- `user_id`、`provider`、`client_id`、`app_id`。
- `platform`、`environment`、`enabled`。
- `last_seen_time`、`invalid_time`、审计字段和逻辑删除字段。
- 唯一约束：`provider + client_id + app_id + environment`。
- 查询索引：`user_id + enabled`。

新增表必须同时提供 MySQL 和 PostgreSQL 升级脚本。

### 4. 先保存消息，再发送推送

消息发送顺序固定为：

```text
保存 base_msg → 事务提交 → 异步发送 UniPush/WebSocket
```

推送通知只携带必要的消息 ID、业务类型、业务 ID 和可选租户 ID，不携带 Token、密码、手机号或完整业务对象。

一期不新增推送队列和 outbox。`base_msg` 保存成功即可保证用户能通过消息中心查看；推送可靠重试留作后续版本。

### 5. 一期消息范围

- 一期默认按现有公告语义发送全局系统公告。
- 不在本 ADR 中同时改造 `base_msg`、`base_notice` 的租户隔离。
- 如果后续要求租户独立公告和独立未读数，必须先增加 `tenant_id`、调整公告接收人范围和消息查询，再接入租户级推送。
- `fa-tn-tenant-id` 请求头不能单独证明现有 `base_msg` 已完成租户隔离。

## 开发说明

### 1. UniPush 2.0 App 配置

- 在 `mobile/src/manifest.json` 配置 UniPush 2.0、App 推送权限和 Android/iOS 应用信息。
- 已声明 App `Push` 原生模块；UniPush AppID、Android 包名、iOS Bundle ID、APNs 证书和厂商推送参数需在 HBuilderX/DCloud 控制台补齐，不提交敏感信息。
- 确认 Android 包名、iOS Bundle ID、UniPush AppID 和推送环境。
- 推送配置只进入 App 打包配置，不把服务端密钥写入 mobile。
- H5、微信小程序保留现有消息列表和前台刷新逻辑。

### 2. 推送设备绑定表

- 在 `fa-base` 增加 Entity、Mapper、Biz 和 Portal Controller。
- 按现有 `BaseDelEntity`、`BaseBiz`、`FaBaseMapper` 风格实现。
- 数据库升级脚本同时放入 `mysql` 和 `postgre` 目录。
- 同一个 CID 重新绑定账号时，停用旧绑定，避免账号串推。

### 3. 设备注册与注销接口

建议接口：

```text
POST /api/portal/push/device/register
POST /api/portal/push/device/unregister
```

- 用户 ID 从登录 Token 获取，不接受客户端传入的用户 ID。
- 注册接口按 Provider、CID、App 和环境幂等更新。
- 注销接口失败不阻断本地退出登录。
- 登录成功、恢复登录、App 回到前台或 CID 变化时重新注册。

### 4. UniPush 服务端发送

- 增加 `fa.push.unipush` 配置，密钥通过环境变量注入。
- 按接收用户查询有效设备，向每个有效 CID 发送通知。
- Provider 返回 CID 失效时，将设备标记为不可用。
- 推送异常记录必要日志，不回滚已保存的站内消息。
- 一期不做批量标签推送、定时推送和推送统计后台页面。

### 5. `MsgHelper` 接入

- 修改公共消息发送链路，不在每个业务调用方重复实现推送。
- `sendAppPush=true` 时发送 UniPush，`false` 时只保存站内消息。
- 修正现有“先 WebSocket 后保存消息”的顺序。
- WebSocket 继续服务已有客户端，mobile 一期不新增 WebSocket 长连接。

### 6. 后台公告发送

- 复用 `NoticeBiz.afterSave` 的现有发送逻辑。
- 公告保存后为目标用户创建 `base_msg`，再由 `MsgHelper` 发送 App 推送。
- 不新增后台推送页面。
- 如果需要单用户、定时、撤回或草稿，另行新增 ADR，不在本期扩展。

### 7. App 推送监听

- 在 `mobile/src/App.vue` 启动阶段注册推送监听。
- `receive`：刷新消息未读数，必要时刷新消息列表。
- `click`：校验 Payload 后进入消息中心。
- 未知或不完整的 Payload 统一进入消息中心，不执行任意页面跳转。
- 推送监听必须使用 App 条件编译，不能影响 H5 和微信小程序启动。

### 8. 登录态绑定设备

- 登录成功后获取 CID 并调用设备注册接口。
- 恢复登录时重新确认 CID 和当前用户绑定关系。
- 退出登录前调用设备注销接口，然后清理 Token、用户、租户和消息状态。
- 设备注册失败只提示日志或非阻塞提示，不影响正常登录。

### 9. 消息同步和点击跳转

- 收到前台推送后刷新现有 `messageStore` 未读数。
- App 回到前台、打开消息页时继续调用现有消息接口，作为推送丢失时的兜底。
- 点击通知一期统一跳转消息中心，不自动标记已读。
- Payload 中的 `messageId`、`buzzType` 和 `buzzId` 为后续业务详情跳转预留。

### 10. 失败和失效设备处理

- 未注册设备、无推送权限或 Provider 暂时不可用时，站内消息仍正常工作。
- Provider 返回无效 CID 时停用设备绑定，避免每条消息重复失败。
- 后端日志不得打印服务端密钥、Token 或完整敏感消息内容。
- 如果后续有“系统通知必达”要求，再增加 outbox、重试次数和推送记录。

## 建议文件范围

后端：

- `fa-base` 推送设备 Entity、Mapper、Biz、Controller。
- `fa-base` MySQL/PostgreSQL DDL 升级脚本。
- `fa-base` UniPush 配置和发送服务。
- `MsgHelper`、`MsgHelperImpl` 和必要的消息配置类。
- `NoticeBiz` 仅在需要调整发送参数时修改。

移动端：

- `mobile/src/manifest.json`。
- `mobile/src/App.vue`。
- `mobile/src/features/fa-core-mobile/push/` 推送 API 封装。
- `mobile/src/features/fa-base-mobile/api/push.ts`。
- `mobile/src/features/fa-base-mobile/stores/auth.ts`、`message.ts` 的登录和消息同步接入。

## 实施顺序

1. 确认 UniPush AppID、Android/iOS 应用信息和全局公告范围。
2. 新增 `base_push_device` 表及双数据库升级脚本。
3. 实现设备注册、注销和幂等绑定。
4. 实现 UniPush 服务端配置和发送服务。
5. 将 UniPush 接入 `MsgHelper`，修正保存与发送顺序。
6. 配置 mobile App 推送并注册 `receive/click` 监听。
7. 接入登录恢复、退出登录和 CID 变化处理。
8. 完成公告发送、前后台接收和点击跳转验证。

## 验收标准

- 后台创建一条公告后，已注册 App 设备可以收到推送。
- App 前台、后台和被关闭三种状态均能完成接收或点击启动。
- 点击系统通知后进入消息中心，消息内容可正常查询。
- 消息未读数与现有 `base_msg` 查询结果一致。
- 一个账号绑定多个设备时，每个有效设备都能收到通知。
- 退出账号后设备不再接收原账号的新推送。
- CID 失效后不会被重复发送，并且不影响站内消息。
- 推送服务关闭或配置缺失时，后台公告和消息中心仍可用。
- 不泄露 Token、服务端密钥和敏感业务内容。
- `pnpm --dir mobile type-check` 通过；Android/iOS 使用自定义基座或正式包完成真机验证。

## 非目标

- H5 浏览器通知。
- 微信小程序订阅消息。
- App WebSocket 长连接。
- 推送偏好设置、分组推送、定时推送、撤回和统计报表。
- 租户级消息隔离改造。
- 推送可靠重试和 outbox。

## 状态更新

- 开发开始后将本文状态更新为 `🟡进行中`。
- 代码完成并等待 Android/iOS 真机验证时更新为 `🔍验证中`。
- 用户确认真机验证通过后更新为 `✅已完成`。
- 如果确认需要租户级消息或可靠重试，应先更新本文决策和功能清单，再开始对应开发。

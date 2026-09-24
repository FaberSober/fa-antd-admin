# ADR：mobile 应用版本更新接口对接

- 状态：🟡进行中
- 日期：2026-09-22
- 范围：`mobile`、`fa-core-mobile`、`fa-base-mobile`、`fa-app`
- 关联：`fa-app/docs/adrs/2026-09-16-app-release-and-uniapp-incremental-update.md`、`ADR-mobile-004-mine-feature.md`、`ADR-mobile-007-page-lifecycle-refresh.md`
- 当前进度：`fa-app` 公开检查接口、`mobile` 更新 Core 能力和 Base 更新流程已完成；更新提示界面与下载进度展示已验证通过；生命周期收敛等待 App 前台恢复和重复触发验证；配置、发布数据准备和其他真机验证待执行

## 功能清单

| 编号 | 模块 | 功能 | 功能详情 | 当前规划 | 进度 |
|---|---|---|---|---|---|
| 1 | `fa-app` | 独立版本检查接口 | APK 与 WGT 分别检查，不相互回退 | 执行开发 | 🔍验证中 |
| 2 | `mobile` 配置 | 应用标识与版本配置 | 配置 `appCode`、渠道、API 地址，并同步 `versionName/versionCode` | 执行开发 | 🕒待处理 |
| 3 | `fa-core-mobile` | 更新接口适配 | 请求检查接口，解析清单并校验版本、包类型和摘要 | 执行开发 | 🔍验证中 |
| 4 | `fa-core-mobile` | 下载与安装基础能力 | 下载进度、SHA-256 校验、安装锁、WGT 和 Android 完整包安装 | 执行开发 | 🔍验证中 |
| 5 | `fa-base-mobile` | 更新提示流程 | 展示更新说明，处理可选更新、强制更新和失败提示 | 执行开发 | ✅已完成 |
| 6 | `mobile` 生命周期 | 启动与前台检查去重 | 统一 App 前台检查入口，避免首页生命周期重复请求 | 执行开发 | 🔍验证中 |
| 7 | `fa-app` 运维 | 发布数据准备 | 创建草稿版本、上传发布包、发布和撤回版本 | 执行开发 | 🕒待处理 |
| 8 | `mobile`/`fa-app` 验证 | 接口和失败场景验证 | 覆盖 APK 优先、WGT 最低 APK、灰度、撤回和摘要错误 | 执行开发 | 🔍验证中 |
| 9 | `mobile` 发布 | App-PLUS 构建与 Android 真机验证 | 验证真实下载、校验、安装和重启后的版本变化 | 执行开发 | 🕒待处理 |
| 10 | `mobile` 文档 | 发布和回滚操作说明 | 记录版本发布、强制更新和撤回流程 | 执行开发 | 🕒待处理 |
| 11 | `fa-base-mobile` 关于页 | 手动检查更新入口 | 展示 APK、WGT 版本并提供手动检查按钮 | 执行开发 | 🔍验证中 |
| 12 | `mobile` 跨平台 | 小程序/H5 独立更新策略 | 小程序使用平台更新管理器，H5 使用 CDN 清单，不走 WGT 安装 | 执行开发 | ✅已完成 |
| 13 | `uni-app` | 自定义二进制差分算法 | 自研 bsdiff 等差分包算法 | 留作未来版本规划 | ⚪已取消 |
| 14 | `fa-core-mobile` | App-PLUS 网络诊断日志 | 可选输出请求与响应信息，敏感值脱敏 | 执行开发 | 🔍验证中 |

## 背景

`fa-app` 分别提供 APK 和 WGT 检查，`mobile` 负责按顺序执行。本次工作目标是把两条发布线、客户端生命周期和 Android 真机验证串成可执行闭环。

## 功能开发说明

### 1. 公开版本检查接口

- 使用 `checkApk` 和 `checkWgt` 两个公开接口。
- 请求字段为 `appCode`、`platform`、`currentVersionCode`、`channel` 和 `deviceId`。
- 先检查 APK；非强制 APK 被跳过后继续检查 WGT。
- WGT 只在资源版本更高、满足最低 APK 要求并命中渠道/灰度规则时返回。

### 2. 应用标识与版本配置

- `VITE_APP_UPDATE_APP_CODE` 使用 `app_apk.short_code`，不作为鉴权密钥。
- `VITE_APP_UPDATE_CHANNEL` 默认使用 `stable`。
- `VITE_APP_VERSION_NAME`、`VITE_APP_VERSION_CODE` 与 `mobile/src/manifest.json` 保持一致。
- App 真机使用可访问的完整 API 地址，正式环境使用 HTTPS。

### 3. 更新 Core 能力

- `fa-core-mobile/update` 统一负责版本读取、检查、下载、校验、安装锁和安装状态。
- 兼容后端 `Long` 序列化为数字字符串；最低 APK 版本为 `null` 时按未设置处理。
- App-PLUS 下载地址解析不依赖全局 `URL` 对象，兼容原生运行时。
- 更新清单缺少下载地址、版本号、包类型或 SHA-256 时，在下载前失败。
- 下载完成和安装前都校验 SHA-256，校验失败不得安装。
- WGT 使用 `plus.runtime.install`；完整包只在支持的 Android App-PLUS 环境中尝试安装。
- Android 完整包安装声明 `INSTALL_PACKAGES` 与 `REQUEST_INSTALL_PACKAGES` 权限；设备仍可能要求用户允许此应用安装未知来源应用。

### 4. Base 更新提示流程

- `fa-base-mobile` 只调用 Base 暴露的更新服务，不在页面内直接使用 `plus.runtime`。
- 可选更新允许稍后处理；`forceUpdate` 不显示取消操作。
- 异常时关闭 loading，提示失败原因，并保留当前版本继续运行。
- 微信小程序和 H5 继续使用各自的平台更新策略，不进入 WGT 安装流程。

### 5. 启动与前台检查去重

- App 前台恢复时触发一次版本检查；首次登录后首页保留一次兜底检查。
- 使用共享的进行中标记和短时间冷却，避免 `onShow`、`onActivated`、`onMounted` 重复弹窗或重复下载。
- 更新检查失败不阻断登录和正常业务；强制更新只在服务端明确返回强制清单时限制取消操作。

### 6. 关于页手动检查

- 分别展示运行中的 APK 版本与 WGT 资源版本。
- 手动检查绕过自动检查冷却，并继续遵循 APK 优先、WGT 后置的更新顺序。
- App-PLUS 未配置 `VITE_APP_UPDATE_APP_CODE` 时，手动检查明确提示配置缺失，不显示“已是最新版本”。
- 没有可用更新时明确提示当前已是最新版本。

### 7. 发布数据准备

- 确认 `app_release` 和 `app_release_package` 对应数据库迁移已执行。
- 创建目标 App 的草稿版本，填写版本名称、递增版本号、渠道、更新说明和强制更新策略。
- APK 和 WGT 分别上传并保存文件信息与 SHA-256；WGT 可选填写最低兼容 APK 版本。
- 校验通过后发布；发现问题时撤回版本，不删除发布文件。
- 当前 `fa-app-pages` 没有通用 `app_release` 管理页面，本 ADR 暂通过已有管理 API 或运维脚本准备测试发布数据，后台维护页面另立需求。

### 8. 验证与发布

- 先执行类型检查和后端编译，再执行 App-PLUS 构建。
- Android 真机验证 WGT 下载、摘要校验、安装和重启后的版本变化。
- 验证 APK 优先、跳过非强制 APK 后继续 WGT、最低 APK、撤回和错误摘要场景。
- 真机验证通过前，相关功能保持 `🔍验证中`，不得提前标记为完成。

### 9. App-PLUS 网络诊断日志

- 设置 `VITE_APP_HTTP_LOG_ENABLED=true` 后，原生 App 输出请求地址、方法、请求体、响应状态与内容、耗时和失败原因。
- 同一开关下输出更新包下载、摘要校验、WGT/APK 安装阶段及原生错误码和错误信息。
- 日志只在 App-PLUS 生效；密码、令牌、联系方式等敏感字段会脱敏，上传文件二进制不输出。

### 10. 本地文件下载地址

- 本地文件存储且未配置 `fa.setting.url.serverHost` 时，返回根路径文件地址，不拼接字面量 `null`。
- 配置了 `serverHost` 时仍返回完整地址；远程存储继续使用存储服务自身返回的 URL。

## 决策

- APK 使用 `app_apk_version`，WGT 使用 `app_release`，两条版本线独立。
- App-PLUS 采用官方 WGT 增量包，不实现自定义二进制差分。
- 更新清单由服务端选择，客户端只负责执行和安全校验；客户端不自行拼装发布包规则。
- 完整包涉及原生能力、权限或插件变更时使用完整 APK/IPA；iOS 完整包不在应用内直接安装，转交 App Store 或企业分发渠道。
- 更新失败、取消或平台不支持时保留当前版本，不阻断正常业务。
- 自定义二进制差分算法不属于本期交付范围。

## 接口契约

```text
POST /api/app/app/release/checkApk
POST /api/app/app/release/checkWgt

{
  "appCode": "app_apk.short_code",
  "platform": "APP_PLUS",
  "currentVersionCode": 100,
  "currentWgtVersionCode": 12,
  "channel": "stable",
  "deviceId": "持久化设备标识"
}
```

响应 `data` 主要字段：

- `hasUpdate`、`updateType`：`NONE`、`WGT`、`FULL`。
- `versionCode`、`versionName`，WGT 可返回 `minSupportedVersionCode`。
- `forceUpdate`、`minSupportedVersionCode`、`releaseNote`。
- `fileId`、`downloadUrl`、`size`、`sha256`。

## 文件范围

预计检查或修改：

- `mobile/src/app.config.ts`
- `mobile/src/env.d.ts`
- `mobile/src/manifest.json`
- `mobile/src/App.vue`
- `mobile/src/features/fa-core-mobile/update/`
- `mobile/src/features/fa-base-mobile/api/update.ts`
- `mobile/src/features/fa-base-mobile/common/update.ts`
- `mobile/src/features/fa-base-mobile/pages/home/index.vue`
- `mobile/docs/handbook/android-apk-release.md`

后端接口和发布模型参考：

- `fa-app/src/main/java/com/faber/api/app/release/rest/AppReleaseController.java`
- `fa-app/src/main/java/com/faber/api/app/release/biz/AppReleaseBiz.java`
- `fa-app/src/main/java/com/faber/api/app/release/vo/req/AppReleaseCheckReq.java`
- `fa-app/src/main/java/com/faber/api/app/release/vo/ret/AppReleaseCheckRet.java`
- `fa-app/src/main/resources/sql/fa-app/mysql/1.0.6_app_ddl.sql`
- `fa-app/src/main/resources/sql/fa-app/postgre/1.0.6_app_ddl.sql`

如果确需修改 `fa-app`，先在 `fa-app` 子模块内完成并验证，再更新父仓库中的子模块指针；不要把后端修改直接混入 `mobile` 提交。

## 实施顺序

1. 确认 API 地址、应用短码、版本号和数据库迁移状态。
2. 准备一条可下载的 `APP_PLUS` 测试发布记录。
3. 核对移动端请求、清单校验和下载地址解析。
4. 收敛 App 启动/前台检查和重复触发逻辑。
5. 执行接口、失败场景和版本选择验证。
6. 执行 `mobile` 类型检查、App-PLUS 构建和 Android 真机验证。
7. 完善发布、撤回和紧急强制更新文档。

## 验收标准

- 未配置应用短码时不发起更新请求；配置正确后能访问公开检查接口。
- 当前版本已是最新、版本已撤回、渠道不匹配或灰度未命中时不显示更新弹窗。
- 匹配 WGT 时能完成下载、SHA-256 校验、安装和重启。
- 当前 APK 低于最低要求时不下发 WGT，且不会回退完整包。
- 强制更新不可取消；下载、校验、安装失败时当前版本仍可继续使用。
- `pnpm --dir mobile type-check` 通过，App-PLUS 构建成功，Android 真机验证通过。
- 发布和撤回步骤有文档记录；未新增第二套请求、WebSocket 或差分算法。

## 非目标

- 不修改 Desktop 客户端版本更新接口。
- 不把微信小程序或 H5 强行改造成 WGT 更新。
- 不在本 ADR 中新增通用 `app_release` 后台维护页面。
- 不实现 iOS 应用内 IPA 安装。
- 不新增自定义二进制差分算法。

## 后续状态更新

- 代码主体存在但尚未完成本 ADR 的配置和真机验证时，保持 `🟡进行中`。
- 开发完成、等待类型检查/构建/真机验证时，将对应功能进度更新为 `🔍验证中`。
- 用户确认验证成功后，更新对应功能和本文状态为 `✅已完成`。
- 验证失败时保持 `🔍验证中`，记录失败原因，不提前标记完成。

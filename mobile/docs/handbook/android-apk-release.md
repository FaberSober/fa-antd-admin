# Android APK 正式打包操作手册

本文适用于 `mobile/` 目录下 uni-app App-PLUS Android 正式 APK 的构建与发布。

## 1. 前置条件

- 已安装 Node.js、pnpm 和 HBuilderX。
- 已安装项目依赖：

  ```bash
  cd mobile
  pnpm install --frozen-lockfile
  ```

- 已准备正式环境 API 地址，Android 真机必须能够访问该地址。
- 已准备 Android 包名、签名证书、证书别名和密码。
- 后端已允许当前 App 的请求来源，并确认上传、文件预览等地址可用。

## 2. 配置正式环境变量

在 `mobile/` 根目录创建 `.env.production.local`：

```env
# Android App-PLUS 接口地址，正式环境使用 HTTPS
VITE_APP_APP_API_BASE_URL=https://api.example.com/api

# App 内 H5 页面或文件预览地址；不使用时可以留空
VITE_APP_APP_H5_PREVIEW_BASE_URL=https://h5.example.com/h5/preview

VITE_APP_NAME=Fa Mobile
VITE_APP_VERSION_NAME=1.0.0
VITE_APP_VERSION_CODE=100
VITE_APP_FA_FROM=FaApp

# 接入 App 更新服务时填写；不使用更新服务时留空
VITE_APP_UPDATE_APP_CODE=
VITE_APP_UPDATE_CHANNEL=stable

# 接入客户端埋点时填写
VITE_APP_TELEMETRY_APP_KEY=
VITE_APP_TELEMETRY_ENV=production
```

Android 端通过 `#ifdef APP-PLUS` 读取 `VITE_APP_APP_API_BASE_URL`。以下变量不用于 Android 正式接口：

| 变量 | 用途 |
| --- | --- |
| `VITE_APP_API_BASE_URL` | 通用/H5 接口地址，App 端会被 App 专用配置覆盖 |
| `VITE_APP_MP_API_BASE_URL` | 微信小程序接口地址 |
| `VITE_DEV_PROXY_TARGET` | H5 开发服务器代理 |
| `VITE_APP_DEV_USERNAME`、`VITE_APP_DEV_PASSWORD` | 开发环境登录页自动填充 |

注意：

- 不要配置 `/api`、`http://localhost/...` 或 `http://127.0.0.1/...`。这些地址在 Android 设备上分别表示相对地址或设备自身。
- 局域网真机测试可以使用 `http://192.168.x.x/api`；正式发布应使用可公开访问的 HTTPS 地址。
- `VITE_` 变量会进入前端构建产物，不要放置密码、私钥、数据库凭据或服务端 Token。
- 当前仓库默认忽略的是 `.env`，不要把包含内部配置的 `.env.production.local` 提交到仓库。

## 3. 同步 App 版本号

`.env.production.local` 中的版本号用于请求头、埋点和应用更新逻辑；APK 原生版本还需要同步修改 [`src/manifest.json`](../../src/manifest.json)：

```json
{
  "versionName": "1.0.0",
  "versionCode": "100"
}
```

每次发布新版本时：

- `versionName` 使用用户可见的版本号，例如 `1.0.1`。
- `versionCode` 使用递增的整数，例如从 `100` 改为 `101`，不能重复或回退。
- `.env.production.local` 和 `src/manifest.json` 中的两个版本值保持一致。

## 4. 构建前检查

在 `mobile/` 目录执行：

```bash
pnpm type-check
pnpm build:app
```

`pnpm build:app` 用于编译 App-PLUS 资源和检查正式环境配置，不等同于最终签名 APK。若命令失败，先处理 TypeScript 或 Vite 编译错误，不要进入 HBuilderX 打包步骤。

## 5. 使用 HBuilderX 打包正式 APK

1. 用 HBuilderX 打开 `mobile/` 目录。
2. 确认 `.env.production.local`、`src/manifest.json` 和接口地址已经是正式环境配置。
3. 执行“发行” → “原生 App-Android”。
4. 填写或确认 Android 包名。
5. 选择正式签名证书，填写证书别名和密码。
6. 选择正式发行/自有证书配置，不要使用调试证书。
7. 开始打包并保存生成的 APK。

Android 包名、签名证书和证书密码不是 `.env` 配置项，应在 HBuilderX/DCloud 的 App 打包配置中管理。签名文件和密码不要提交到仓库。

## 6. 发布前验收

安装生成的正式 APK 到 Android 真机，至少检查：

- 能正常启动并显示正确的应用名称和版本号。
- 登录、退出登录和 Token 失效后重新登录正常。
- 租户切换、首页、消息、联系人和个人中心请求正常。
- 文件上传、文件预览和图片加载正常。
- API 请求没有访问 `localhost`、`127.0.0.1` 或错误环境地址。
- 如果启用 App 更新，能正确读取当前版本并发现可用更新。
- APK 使用正式签名证书，能够覆盖安装或按发布策略正常升级。

可选地为最终文件生成校验值：

```bash
shasum -a 256 path/to/fa-mobile-release.apk
```

## 7. 常见问题

### 安装后提示网络请求失败

检查 `VITE_APP_APP_API_BASE_URL` 是否为完整地址，手机是否能访问域名/API；不要使用 H5 的 `/api` 相对地址。修改环境变量后必须重新编译和打包，已生成的 APK 不会自动读取新配置。

### 修改了 `.env` 但 APK 仍使用旧地址

确认文件位于 `mobile/` 根目录，变量名以 `VITE_` 开头，并清理后重新执行构建/打包。Android 端优先检查 `VITE_APP_APP_API_BASE_URL`，不要只修改 `VITE_APP_API_BASE_URL`。

### APK 版本号没有变化

检查 `src/manifest.json` 中的 `versionName` 和 `versionCode`，因为仅修改 `.env.production.local` 不会自动修改 APK 原生版本元数据。

### 正式 APK 无法覆盖安装

通常是签名证书或包名不一致。使用与已发布版本相同的包名和签名证书，并确保 `versionCode` 大于已安装版本。

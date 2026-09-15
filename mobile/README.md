# Fa Mobile

独立的 uni-app Vue 3 + TypeScript 移动端宿主，页面按 `src/features/*` 组织。

当前 `fa-base-mobile` 先以宿主内的 Feature 目录落地；确定远程仓库地址后，再按同一路径切换为 Git submodule。

## 开发命令

在 `mobile/` 目录执行：

```bash
pnpm install
pnpm dev:h5
pnpm dev:mp-weixin
pnpm type-check
```

也可以在项目根目录使用 `pnpm --dir mobile <command>`。

微信小程序开发时，将 `dist/dev/mp-weixin` 导入微信开发者工具。H5 使用相对 `/api` 地址时，会由 Vite 代理到 `VITE_DEV_PROXY_TARGET`。

Android/iOS 真机运行和 App 打包按需要使用 HBuilderX；CLI 工程可以直接用 HBuilderX 打开。

## 环境变量

复制 `.env.example` 为 `.env.local` 后按实际环境修改。H5 使用 `VITE_APP_API_BASE_URL`，微信小程序使用 `VITE_APP_MP_API_BASE_URL`，App 使用 `VITE_APP_APP_API_BASE_URL`。小程序和 Android 真机不能使用相对地址 `/api`，应配置局域网可访问的 HTTPS 或局域网地址。

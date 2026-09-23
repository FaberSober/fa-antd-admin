# H5 Feature / Project 目录

> 此文件由 `pnpm catalog:generate` 生成，请勿手工修改。

## Features

| Feature ID | 名称 | 依赖 | 路由 | 生命周期 |
|---|---|---|---:|---|
| `fa-h5-app-pages` | H5 APP 下载 | - | 2 | active |
| `fa-h5-base-pages` | H5 基础页面 | - | 2 | active |
| `fa-h5-demo-pages` | H5 组件 Demo | `fa-h5-base-pages`、`fa-h5-file-preview-pages` | 2 | active |
| `fa-h5-file-preview-pages` | H5 文件预览 | - | 1 | active |

## Projects

| Project ID | 标题 | 默认路由 | Features |
|---|---|---|---|
| `default` | FA H5 | `fa-h5-base-pages.home` | `fa-h5-base-pages`、`fa-h5-file-preview-pages`、`fa-h5-app-pages`、`fa-h5-demo-pages` |
| `demo` | FA H5 Demo | `fa-h5-base-pages.home` | `fa-h5-base-pages`、`fa-h5-file-preview-pages`、`fa-h5-app-pages`、`fa-h5-demo-pages` |

## Routes

| Project | Route ID | Path | Permission |
|---|---|---|---|
| `default` | `fa-h5-base-pages.home` | `/app/home` | - |
| `default` | `fa-h5-base-pages.me` | `/app/me` | - |
| `default` | `fa-h5-file-preview-pages.preview` | `/preview` | - |
| `default` | `fa-h5-app-pages.download` | `/app/:shortCode` | - |
| `default` | `fa-h5-app-pages.versions` | `/app/:shortCode/versions` | - |
| `default` | `fa-h5-demo-pages.overview` | `/app/demo` | `/h5/app/demo` |
| `default` | `fa-h5-demo-pages.button` | `/app/demo/button` | `/h5/app/demo/button` |
| `demo` | `fa-h5-base-pages.home` | `/app/home` | - |
| `demo` | `fa-h5-base-pages.me` | `/app/me` | - |
| `demo` | `fa-h5-file-preview-pages.preview` | `/preview` | - |
| `demo` | `fa-h5-app-pages.download` | `/app/:shortCode` | - |
| `demo` | `fa-h5-app-pages.versions` | `/app/:shortCode/versions` | - |
| `demo` | `fa-h5-demo-pages.overview` | `/app/demo` | `/h5/app/demo` |
| `demo` | `fa-h5-demo-pages.button` | `/app/demo/button` | `/h5/app/demo/button` |

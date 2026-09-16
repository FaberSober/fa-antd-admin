# H5 File Preview Demo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在不依赖 H5 登录和上传功能的情况下，为 Demo 增加一个可直接打开的文件预览样例，并支持配置一个已上传的公共文件进行预览。

**Architecture:** Demo 列表新增文件预览入口，进入现有 `/preview` 全屏页面的受控 `demo=file` 模式。无配置时使用 H5 内置文本样例；配置 `VITE_APP_H5_PREVIEW_DEMO_FILE_ID` 时，仅使用该固定 fileId 访问现有公开文件流，并用文件名配置推断格式。正式业务预览继续只接受一次性 ticket，不允许通过查询参数任意指定 fileId。

**Tech Stack:** React 19、React Router、Ant Design Mobile、现有 H5 File Preview、Vite 环境配置、CSS Modules。

---

### Task 1: 增加未登录 Demo 文件源

**Files:**
- Create: `public/demo/file-preview/sample.txt`
- Create: `src/platform/config.ts`
- Modify: `src/vite-env.d.ts`
- Modify: `.env.example`

**Steps:**

1. 增加不包含敏感信息的本地文本样例，保证没有后端文件和登录态时 Demo 仍可用。
2. 在 H5 platform 配置层读取可选的 Demo `fileId` 和文件名，避免 Feature 直接读取 `import.meta.env`。
3. 补充环境变量类型和示例配置；固定 fileId 只作为 Demo 配置，不接受 URL 任意覆盖。

### Task 2: 让现有预览页支持受控 Demo 模式

**Files:**
- Modify: `features/fa-h5-file-preview-pages/index.ts`
- Modify: `features/fa-h5-file-preview-pages/pages/preview/PreviewPage.tsx`

**Steps:**

1. 从公共出口暴露预览路由，供 Demo Feature 按路由契约复用。
2. 识别 `demo=file` 查询标记；无登录时使用本地样例或配置的固定 fileId 构造 `FilePreviewResource`。
3. 保持 ticket 分支原有的单次兑换、地址栏清理和权限行为不变。
4. Demo 资源关闭下载权限；文件读取失败沿用现有错误状态。

### Task 3: 接入 Demo 列表

**Files:**
- Modify: `features/fa-h5-demo-pages/feature.ts`
- Modify: `features/fa-h5-demo-pages/pages/overview/DemoOverviewPage.tsx`

**Steps:**

1. 声明 Demo Feature 对文件预览 Feature 的公共出口依赖。
2. 在列表中增加“文件预览”条目，点击进入 `/preview?demo=file`；Button Demo 保持原入口。
3. 说明该 Demo 默认使用本地样例，可通过环境变量切换为已上传的公共文件。

### Task 4: 更新决策文档并验证

**Files:**
- Modify: `docs/adrs/0001-h5-file-preview-webview.md`
- Modify: `docs/feature-catalog.generated.md`

**Steps:**

1. 在 ADR 中记录未登录 Demo 的边界、fileId 配置方式和安全限制。
2. 执行 `pnpm run select:project`、`pnpm run catalog:generate` 和 `pnpm run check`。
3. 执行修改范围的 Biome 检查，并用 `pnpm dev:h5` 验证开发服务器启动。


# H5 Demo Entry Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在默认 H5 项目中提供 Demo 入口、Demo 功能列表和第一个 Button 样式演示页，同时把工作台首页收敛为真实功能入口。

**Architecture:** 复用现有 `fa-h5-demo-pages` Feature，通过 Manifest 注册 `/app/demo` 列表路由和 `/app/demo/button` 详情路由，并由默认 Project 显式装配。页面继续使用路由级 lazy import，首页只消费 Registry 的 `homeEntries`，不再展示模块装配和异常状态演示内容。

**Tech Stack:** React 19、React Router、Ant Design Mobile、CSS Modules、H5 Feature/Project Registry。

---

### Task 1: 扩展 Demo Feature 路由与入口

**Files:**
- Modify: `features/fa-h5-demo-pages/routes.ts`
- Modify: `features/fa-h5-demo-pages/feature.ts`
- Modify: `features/fa-h5-demo-pages/README.md`
- Modify: `src/projects/default.ts`

**Steps:**

1. 保留 `/app/demo` 作为 Demo 功能列表，新增 Button Demo 路由 `/app/demo/button`。
2. 将 Demo Feature 的首页入口标题改为“Demo”，描述改为“查看 H5 组件交互示例”。
3. 默认 Project 显式装配 `fa-h5-demo-pages`，保持 Demo Project 可用。
4. 更新 Feature README，说明它是 H5 的组件示例入口。

### Task 2: 实现 Demo 功能列表与 Button Demo

**Files:**
- Modify: `features/fa-h5-demo-pages/pages/overview/DemoOverviewPage.tsx`
- Modify: `features/fa-h5-demo-pages/pages/overview/DemoOverviewPage.module.css`
- Create: `features/fa-h5-demo-pages/pages/button/ButtonDemoPage.tsx`
- Create: `features/fa-h5-demo-pages/pages/button/ButtonDemoPage.module.css`

**Steps:**

1. 将原装配验证说明页改为 Demo 功能列表，展示 Button Demo 卡片并支持点击进入详情。
2. Button Demo 展示基础颜色、填充方式、尺寸和常见状态，控制示例数量，适配移动端宽度。
3. 两个页面提供返回工作台/返回 Demo 列表的操作，页面标题使用统一 Hook。
4. 使用现有 H5 Token 和 Ant Design Mobile，不引入新的 UI 依赖。

### Task 3: 清理工作台首页与应用壳

**Files:**
- Modify: `features/fa-h5-base-pages/pages/home/HomePage.tsx`
- Modify: `features/fa-h5-base-pages/pages/home/HomePage.module.css`
- Modify: `src/layouts/AppShell.tsx`
- Modify: `src/layouts/AppShell.module.css`

**Steps:**

1. 首页保留简洁欢迎区和 Registry 提供的功能入口卡片。
2. 移除 Feature 数量、模块装配能力说明、平台异常状态演示按钮等内部验证内容。
3. 应用壳移除 BETA、Feature 数量和 M2 里程碑文案，保留稳定的 FA H5 品牌和移动工作台标题。

### Task 4: 同步生成文件与工程校验

**Files:**
- Modify: `scripts/validate-projects.ts`
- Modify: `docs/feature-catalog.generated.md`
- Modify: `docs/m2/module-composition-beta.md`

**Steps:**

1. 更新项目组合断言，确认 default 和 demo 都注册 Demo 列表及 Button Demo 路由。
2. 执行 `pnpm run select:project` 和 `pnpm run catalog:generate`，刷新 `.h5` 路由页与 Feature 目录。
3. 执行 `pnpm run check`，确认项目矩阵、边界、目录和 TypeScript 检查通过。

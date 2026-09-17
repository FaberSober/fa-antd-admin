---
name: fa-admin-frontend
description: FA Admin 前端开发与维护规范。用于本仓库 React/Vite 后台管理页面、普通或树形 CRUD、feature 模块、services/types、@fa/ui 表格/表单/选择器/弹窗、文件上传、路由标签页、状态与事件、主题样式、Vite/HMR/pnpm 或复杂交互组件任务。
---

# FA Admin 前端

## 执行顺序

1. 先检查目标 feature、最接近页面以及 `@fa/ui` 当前源码，确认目录、别名、类型、组件 API 和后端契约。
2. 根据下表选择任务入口；修改前完整读取所有适用的 reference，不加载无关文档。
3. 优先复用现有 services、types、hooks 和 `@fa/ui` 组件。reference 与当前代码冲突时，以当前源码、类型声明和目标 feature 风格为准。
4. 只实施需求所需的最小改动；不要顺带重组 feature、升级依赖、替换状态方案或修改全局主题。
5. 完成后做局部类型、语法和页面检查。除非用户明确要求，不运行 Vite/pnpm/npm 完整构建。

## Reference 路由

| 任务 | 必读 reference |
|---|---|
| 创建/重组 feature、configs、services/types 聚合、页面目录 | [references/feature-modules.md](references/feature-modules.md) |
| 标准 CRUD 列表、service/type、弹窗、删除/导出 | [references/crud-pages.md](references/crud-pages.md) |
| `BaseBizTable`、查询表单、日期、Select/SearchSelect、Tree、Tabs、loading | [references/tables-forms-selectors.md](references/tables-forms-selectors.md) |
| 文件上传/预览、Office、拖拽、滚动列表、3D、FormEditor | [references/files-rich-components.md](references/files-rich-components.md) |
| 路由/query、菜单标签页、首页卡片、登录、页面缓存、事件总线、Socket | [references/navigation-state-events.md](references/navigation-state-events.md) |
| CSS、暗色主题、Iconify/SVG 图标、Prism | [references/styling-theme-icons.md](references/styling-theme-icons.md) |
| 环境变量、Vite/HMR、pnpm workspace、依赖检查 | [references/tooling-vite.md](references/tooling-vite.md) |

## 关键代码入口

- CRUD 列表：`frontend/apps/admin/features/fa-admin-demo-pages/pages/admin/demo/table/table/index.tsx`
- CRUD 弹窗：`frontend/apps/admin/features/fa-admin-demo-pages/pages/admin/demo/table/table/modal/StudentModal.tsx`
- Service/Type：`frontend/apps/admin/features/fa-admin-demo-pages/services/demo/student.ts`、`frontend/apps/admin/features/fa-admin-demo-pages/types/Demo.ts`
- 当前 feature：`frontend/apps/admin/features/fa-ai-pages`、`frontend/apps/admin/features/fa-vision-pages`
- 表格 Hook：`frontend/fa-ui/packages/ui/src/hooks/useTableQueryParams.tsx`
- UI 组件：`frontend/fa-ui/packages/ui/src/components`

使用 `rg` 定位同类实现；不要依赖 `frontend/fa-ui/doc/frontend` 中的历史路径或旧组件签名。

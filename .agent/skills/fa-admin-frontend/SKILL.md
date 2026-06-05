---
name: fa-admin-frontend
description: FA Admin frontend development conventions for this repository. Use when Codex needs to add or modify frontend admin React CRUD pages, feature modules, services, types, modals, helper/search-select components, table query pages, @fa/ui based management screens, or frontend wiring that matches backend CRUD resources in zj-assets-manage-api.
---

# FA Admin 前端

## 概览

后台管理前端页面默认采用本仓库“轻状态、轻业务、强复用”的 CRUD 组合风格：共享 `services`/`types`，复用 `@fa/ui` 表格工具，新增/编辑使用独立弹窗，页面层只做组合。优先参考最接近的现有 feature 或页面，不引入新的组织方式。

## 开始前

1. 修改前先查看最接近的页面或 feature。常用参考：
   - `frontend/apps/admin/features/fa-admin-demo-pages/pages/admin/demo/table/table/index.tsx`
   - `frontend/apps/admin/features/fa-admin-demo-pages/pages/admin/demo/table/table/modal/StudentModal.tsx`
   - `frontend/apps/admin/features/fa-admin-demo-pages/services/demo/student.ts`
   - `frontend/apps/admin/features/fa-admin-demo-pages/types/Demo.ts`
   - `frontend/apps/admin/features/fa-app-pages`
2. 确认后端资源路径和主键类型。前端 service 的资源名应与后端 Controller 的资源路径片段一致。
3. 标准 CRUD 默认按顺序补齐 `types`、`services`、列表页 `index.tsx`、弹窗 `modal/XxxModal.tsx`。
4. 优先使用 `@fa/ui`、`antd`、已有 hooks 和模块别名。不要在页面里手写表格状态、拼接请求 URL 或重复实现通用 CRUD 行为。
5. 创建或重组 feature 模块时，阅读 [references/feature-modules.md](references/feature-modules.md)。

## 标准 CRUD 页面结构

普通后台 CRUD 页面默认使用以下结构：

- `pages/.../index.tsx`：列表页主体，负责查询表单、表格列定义、加载、删除、导出等组合逻辑。
- `pages/.../modal/XxxModal.tsx`：新增/编辑表单弹窗。
- `pages/.../helper/...`：页面专用辅助组件，例如搜索选择器。
- `services/...`：接口服务定义。
- `types/...`：共享业务类型。

不要在页面里内联大段业务类型。新增/编辑表单能复用弹窗模式时，不要直接堆在列表页里。

## 服务与类型

单实体接口服务基于 `BaseApi<Entity, Key>` 定义，并通过模块 service index 聚合导出。

```ts
class Api extends BaseApi<Demo.Student, number> {}
export default new Api(GATE_APP.demo, 'student');
```

业务类型使用命名空间组织，例如 `namespace Demo`。实体类型优先继承 `Fa.BaseDelEntity` 或相邻代码使用的本地基础类型。页面、弹窗、表格列、hooks 的泛型都显式使用对应实体类型。

导入优先走现有别名或聚合出口，例如 `@/services`、`@/types`、`@/configs`、`@features/fa-app-pages/...`。不要跨 feature 使用过深相对路径直连具体 service 文件。

## 列表页

使用函数组件。页面顶部定义 `serviceName` 用于标题和提示文案，定义 `biz` 传给 `BaseBizTable`。

常见初始化：

```ts
const [form] = Form.useForm();

const {
  queryParams,
  setFormValues,
  handleTableChange,
  setSceneId,
  setConditionList,
  fetchPageList,
  loading,
  list,
  dicts,
  paginationProps,
} = useTableQueryParams<Entity>(api.page, {}, serviceName);
```

常用能力：

- 删除使用 `useDelete(api.remove, fetchPageList, serviceName)`。
- 导出使用 `useExport(api.exportExcel, queryParams)`。
- 表格主体使用 `BaseBizTable`。
- 重置使用 `clearForm(form)`。
- 查询提交调用 `setFormValues`。

查询区域保持简洁，查询、重置、新增、导出等按钮通常放在同一个 `antd` `Space` 中。

## 表格

列定义优先封装为 `genColumns()`，不要在 JSX 中内联大段列配置。排序信息从 `queryParams.sorter` 获取。

优先使用 `BaseTableUtils`：

- `genIdColumn`
- `genSimpleSorterColumn`
- `genEnumSorterColumn`
- `genDateSorterColumn`
- `genBoolSorterColumn`
- `genDictSorterColumn`
- `genCtrColumns`
- `genUpdateColumns`

只有标签、嵌套对象等确实需要自定义展示的字段才补充 `render`。操作列通常放在最右侧，编辑、删除等操作使用 `Space` 承载。

`BaseBizTable` 通常传入 `rowKey`、`biz`、`columns`、`pagination`、`loading`、`dataSource`、`onChange`、`refreshList`、`batchDelete`。页面支持场景查询和条件配置时，继续传入 `onSceneChange`、`onConditionChange`。

## 弹窗

新增和编辑使用独立 `XxxModal`。组件通过 `CommonModalProps<Entity>` 接收 `record`、`fetchFinish`、`addBtn`、`editBtn` 等参数。弹窗容器优先使用 `DragModal`，提交通过 `form.submit()` 驱动。

初始化和提交逻辑保持集中：

- `getInitialValues()` 负责根据 `record` 准备表单初始值。
- 有 `record` 时走更新；无 `record` 时走新增。
- 成功后关闭弹窗并调用 `fetchFinish()` 刷新列表。
- 提交 loading 使用 `useApiLoading([api.getUrl('save'), api.getUrl('update')])`。
- 反馈使用 `FaUtils.showResponse(res, '新增XX')` 或 `FaUtils.showResponse(res, '更新XX')`。
- 日期回填和提交格式转换按相邻代码使用 `FaUtils.getInitialKeyTimeValue(...)`、`FaUtils.getDateStr000(...)`。

常用组件优先复用 `@fa/ui`：`DragModal`、`BaseBoolRadio`、`DictDataSelector`、`DictEnumApiSelector`、`DictEnumApiRadio`、`FaHref`、`BaseSearchSelect`。

## 搜索选择器

页面专用搜索选择器放在 `helper` 目录。通常基于 `BaseSearchSelect` 封装，并固定 `valueKey`、`labelKey`、`serviceApi.search`、`serviceApi.getById`、`serviceApi.findList`。

搜索通常使用 `page`；`findList` 通常使用 `list` 配合 `id#$in` 条件。

## 布局

优先使用现有原子 class，除非相邻页面有特殊写法：

- 页面外层：`fa-content fa-full fa-flex-column`
- 头部区域：`fa-flex-row-center fa-p8`
- 弹窗表单布局：`FaUtils.formItemHalfLayout`

列表页只做组合。重复 API 行为下沉到 services，重复 UI 行为下沉到 helper/components，数据转换放在提交或初始化函数里，不要写在 render 表达式中。

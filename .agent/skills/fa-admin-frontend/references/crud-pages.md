# 标准 CRUD 页面

从原 `SKILL.md` 的 CRUD、service/type、列表、弹窗和布局规范整理，并以 demo 页面当前实现为基线。

## 目录

- 实现顺序
- Service 与 Type
- 列表页
- 弹窗
- 布局与职责
- 检查清单

## 实现顺序

标准后台 CRUD 按以下顺序补齐：

1. 对齐后端资源路径、主键类型、字段、枚举/字典和分页结构。
2. 在共享 `types` 增加 Entity/请求/响应类型。
3. 在 `services` 增加 `BaseApi` service 及必要自定义方法。
4. 创建列表页 `index.tsx`。
5. 创建 `modal/XxxModal.tsx`；页面专用选择器放入 `helper/` 或 `select/`。
6. 更新模块聚合出口，并做局部检查。

## Service 与 Type

```ts
class Api extends BaseApi<Demo.Student, number> {}

export default new Api(GATE_APP.demo, 'student');
```

- `BaseApi<Entity, Key>` 的 `Key` 与后端 Controller/Entity 一致。
- 构造器资源名与后端 Controller 资源路径片段一致。
- 自定义方法使用 `this.get/post/delete/...` 和相对资源路径，显式声明参数及返回数据类型。
- 从 `@/configs`、`@/services`、`@/types` 或 feature 聚合出口导入，不在 JSX 里拼 URL。
- 实体类型优先继承 `Fa.BaseDelEntity`，可空字段使用 `?`/联合类型准确表达。

## 列表页

页面使用函数组件，通过 `useTableQueryParams<Entity>(api.page, initParams, serviceName)` 管理分页、排序、查询、场景和字典：

```ts
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

- 删除使用 `useDelete<Key>(api.remove, fetchPageList, serviceName)`。
- 导出使用 `useExport(api.exportExcel, queryParams)`。
- 表格使用 `BaseBizTable`，列定义封装为 `genColumns()`。
- 查询提交调用 `setFormValues`；重置使用 `clearForm(form)`。
- 批量删除、组合查询和场景能力只有页面需要时才传入。
- 具体表格、查询字段和选择器规范见 [tables-forms-selectors.md](tables-forms-selectors.md)。

## 弹窗

新增/编辑使用独立 `XxxModal`，通过 `CommonModalProps<Entity>` 接收 `record`、`fetchFinish`、`addBtn`、`editBtn` 等现有参数。容器优先使用 `DragModal`，`onOk` 调用 `form.submit()`。

```ts
const loading = useApiLoading([
  api.getUrl('save'),
  api.getUrl('update'),
]);
```

- `getInitialValues()` 只负责从 `record` 准备表单值。
- 有 `record` 时更新，无 `record` 时新增；不要依靠不稳定的字段猜测模式。
- 提交前集中转换日期、文件 ID、嵌套对象等值，不在 render 中转换。
- 更新时按后端契约合并主键/原记录，避免遗漏只读但必需字段。
- 成功后使用 `FaUtils.showResponse(...)`、关闭弹窗并调用 `fetchFinish?.()`。
- `useApiLoading` 传入与请求实际 URL 一致的 `api.getUrl(...)`。
- 日期初始化/提交复用当前 `FaUtils.getInitialKeyTimeValue`、`FaUtils.getDateStr000` 等工具。

优先复用 `@fa/ui` 的 `BaseBoolRadio`、`DictDataSelector`、`DictEnumApiSelector`、`DictEnumApiRadio`、`UploadImgLocal`、`FaHref` 等组件。

## 布局与职责

常见列表页外层：

- 页面：`fa-content fa-full fa-flex-column`
- 查询/标题头部：`fa-flex-row-center fa-p8`
- 弹窗表单：`fa-grid2 fa-mt12` 配合 `FaUtils.formItemHalfLayout`

列表页只组合查询、表格和弹窗。请求逻辑放 services，可复用 UI 放 components/helper，类型放 types，数据转换放初始化或提交函数。不要在页面内重复实现通用分页、删除、上传、loading 或 URL 处理。

## 检查清单

- 后端路径、主键和字段类型是否一致。
- service/types 是否从聚合出口可用。
- `rowKey`、删除 Key 泛型和批量删除参数是否一致。
- 查询后是否回到第一页，成功保存后是否刷新列表。
- loading URL、日期、字典、枚举和文件 ID 是否正确。
- 组件函数是否使用大写业务名，避免命名为 `index`。

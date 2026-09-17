# 表格、表单与选择器

归并自 `table.md`、`form.md`、`select.md`、`tree.md`、`date.md`、`loading.md` 和 `tabs.md`。

## 目录

- BaseBizTable 与列
- 查询表单
- 普通表单
- Select 与 SearchSelect
- Tree/Cascader
- Loading
- Tabs

## BaseBizTable 与列

标准 CRUD 使用 `useTableQueryParams` + `BaseBizTable`，不要自行维护重复的分页、排序、字典和加载状态。常用属性包括 `rowKey`、`biz`、`columns`、`pagination`、`loading`、`dataSource`、`onChange` 和 `refreshList`。

列定义放在 `genColumns()` 中，并从 `queryParams.sorter` 获取当前排序：

```ts
function genColumns() {
  const { sorter } = queryParams;
  return [
    BaseTableUtils.genIdColumn('ID', 'id', 70, sorter),
    BaseTableUtils.genSimpleSorterColumn('名称', 'name', 120, sorter),
    BaseTableUtils.genEnumSorterColumn('状态', 'status', 100, sorter, dicts),
    BaseTableUtils.genDateSorterColumn('日期', 'bizDate', 110, sorter),
  ] as FaberTable.ColumnsProp<Entity>[];
}
```

优先使用 `BaseTableUtils` 的 ID、普通、枚举、日期/时间、布尔、字典、审计字段和操作列生成器。只有标签、嵌套对象、业务操作等确需定制时添加 `render`。

组合查询需要自定义输入时，在列上提供 `tcCondComponent` 或 `tcCondComponentElement`，并把 value、label 和 index 正确回传；优先参考当前 `UserList.tsx` 和 `FaberTable.TcCondProp` 类型，不复制历史签名。

## 查询表单

查询字段直接传给 `setFormValues`。日期范围等 UI 临时字段在提交时转换为后端查询操作符，并从最终 query 中移除：

```tsx
<Form
  form={form}
  layout="inline"
  onFinish={({ dateRange, ...rest }) =>
    setFormValues({
      ...rest,
      'time#$min': FaUtils.parseRangeDateSuffix(dateRange, 0, '00:00:00'),
      'time#$max': FaUtils.parseRangeDateSuffix(dateRange, 1, '23:59:59'),
    })
  }
>
  <Form.Item name="dateRange" label="日期">
    <WindDateRangerPicker />
  </Form.Item>
</Form>
```

核对日期范围工具的当前参数含义和后端边界语义。查询提交会回到第一页；重置使用 `clearForm(form)`，需要保留字段时使用仓库现有 exclude 版本。

## 普通表单

- `InputNumber` 配合 number 校验和必要的 `transform: Number`，避免字符串/undefined 误判。
- `Switch`、`Checkbox` 在 `Form.Item` 使用 `valuePropName="checked"`。
- 日期组件值通常是 Dayjs，初始化和提交必须转换，不能把组件对象直接传给后端。
- 必填、范围、长度和格式通过 Ant Design rules 表达；错误文案使用业务字段名称。
- 表单 props 和布局跟随相邻弹窗，不同时混用多套布局方案。

```tsx
<Form.Item
  name="year"
  label="年份"
  rules={[{ required: true, type: 'number', transform: Number }]}
>
  <InputNumber min={1900} max={2100} />
</Form.Item>
```

## Select 与 SearchSelect

数据量较小、可一次加载时封装 `BaseSelect`：

```tsx
export default function RoleSelect(
  props: Omit<BaseSelectProps<Rbac.Role>, 'serviceApi'>,
) {
  return <BaseSelect serviceApi={roleApi} placeholder="请选择角色" {...props} />;
}
```

外部条件变化时，将条件用于 service，并放入 `extraParams` 触发重新获取。不要每次 render 创建不稳定且无依赖约束的副作用。

大数据搜索使用 `BaseSearchSelect<Entity, Key>`，提供：

- `search(searchValue)`：分页搜索，通常只取前 20 条。
- `getById(value)`：单选值回显。
- `findList(ids)`：多选值批量回显。
- `valueKey`、`labelKey`：与实体真实字段一致。

```tsx
<BaseSearchSelect<Tn.Tenant, string>
  valueKey="id"
  labelKey="name"
  serviceApi={{
    search: (name) => tenantApi.page({ current: 1, pageSize: 20, query: { name } }),
    getById: tenantApi.getById,
    findList: (ids) => tenantApi.list({ 'id#$in': ids }),
  }}
  {...props}
/>
```

把通用业务选择器放模块 components，把页面专用选择器放 helper/select。Key 泛型、单选/多选 value 和 `findList` 参数必须一致。

## Tree/Cascader

树选择优先封装 `BaseCascader` 或使用现有 `BaseTree`：

```tsx
export default function TreeCascade(
  props: Omit<BaseCascaderProps<Demo.Tree>, 'serviceApi'>,
) {
  return <BaseCascader showRoot={false} serviceApi={treeApi} {...props} />;
}
```

配置 `showRoot`、root ID、Key 类型、multiple、disabled IDs 和 max level 时核对当前组件类型。业务变更后刷新树优先使用现有 `FaUtils.refreshTree()` 或当前 `TREE_REFRESH_BUS_KEY` 机制，不发明新的事件名。

## Loading

请求 loading 使用 `useApiLoading`，key 必须与请求层记录的 URL 完全一致：

```ts
const loading = useApiLoading([
  api.getUrl('save'),
  api.getUrl('update'),
]);
```

单个 URL 可直接传字符串。不要再接入已废弃的旧 ApiEffect 组件，也不要为同一请求额外维护手工 loading，除非存在请求之外的本地异步步骤。

## Tabs

普通页面区域使用 Ant Design `Tabs` 的 `items` API，外层沿用 `fa-full-content-p12 fa-flex-column fa-tabs` 等相邻布局。路由级菜单标签页的 `addTab/removeTab` 规则见 [navigation-state-events.md](navigation-state-events.md)，不要把两类 Tabs 混为一套状态。

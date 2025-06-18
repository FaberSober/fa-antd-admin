# table

## 表头查询
### 时间范围
```typescript jsx
<Form form={form} layout="inline" onFinish={(av) => {
  setFormValues({
    ...av,
    'time#$min': FaUtils.parseRangeDateSuffix(av.dateRange, 0, '00:00:00'),
    'time#$max': FaUtils.parseRangeDateSuffix(av.dateRange, 0, '23:59:59'),
    dateRange: '',
  })
}}>
  <Form.Item name="dateRange" label="日期">
    <WindDateRangerPicker />
  </Form.Item>

  <Space>
    <Button htmlType="submit" loading={loading} icon={<SearchOutlined />}>查询</Button>
    <Button onClick={() => clearForm(form)}>重置</Button>
  </Space>
</Form>
```

## 组合查询配置说明
### 下拉选择框Select
```typescript jsx
{
    ...BaseTableUtils.genSimpleSorterColumn('场站', 'factoryId', 200, sorter),
    render: (_v, r) => r.factoryName,
    // 方式1
    tcCondComponent: ({index, value, callback, mode, ...props}: FaberTable.TcCondProp) => (
        <SubjectFactorySelect value={value} onChange={(v, o) => callback(v, index, FaUtils.optionsToLabel(o))} {...props} />
    ),
    // 方式2
    tcCondComponentElement: SubjectFactorySelect,
},
```

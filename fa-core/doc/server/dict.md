# Dict字典

## 管理字典
在后台“系统管理/字典管理”中创建字典。

## Java Entity配置
参考`Student.java`，需要使用`@FaColDict`注解，注解填写字典编码。
```java
// 测试字典返回-选择列表
@FaColDict("base_dict_test_options")
@ExcelProperty("字典值1")
private String dict1;
```

## 分页接口返回字典数据
1. 配置`@FaColDict`注解后，BaseController的page方法会自动将字典数据返回给前端。
2. 代码在BaseBiz中
```java
    public TableRet<T> selectPageByQuery(QueryParams query) {
        // ....

        // add dict, enum options
        this.addEnumOptions(table, getEntityClass());
        this.addDictOptions(table, getEntityClass()); // 这里解析`@FaColDict`注解并返回字典列表

        // decorate
        decorateList(table.getData().getRows());

        return table;
    }
```

## 前端table表格中显示字典数据
如下：
```typescript
BaseTableUtils.genDictSorterColumn('字典值1', 'dict1', 100, sorter, dicts, 'base_dict_test_options'),
```

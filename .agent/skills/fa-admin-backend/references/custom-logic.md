# 自定义后端逻辑

## 自定义分页

当基类 `/page` 不能满足查询要求时，使用 `BasePageQuery<ReqVo>`、PageHelper、Mapper 查询方法和 `TableRet`。

Controller：

```java
@FaLogOpr(value = "检索文件分页", crud = LogCrudEnum.R)
@LogNoRet
@RequestMapping(value = "/queryFilePage", method = RequestMethod.POST)
@ResponseBody
public TableRet<StoreFile> queryFilePage(@RequestBody BasePageQuery<StoreFileQueryVo> params) {
    return baseBiz.queryFilePage(params);
}
```

Biz：

```java
public TableRet<StoreFile> queryFilePage(BasePageQuery<StoreFileQueryVo> query) {
    PageInfo<StoreFile> info = PageHelper.startPage(query.getCurrent(), query.getPageSize())
            .doSelectPageInfo(() -> baseMapper.queryFile(query.getQuery(), query.getSorter()));
    return new TableRet<>(info);
}
```

需要前端服务对接时：

```typescript
pageVo = (params: Fa.BasePageQuery<Rbac.RbacUserRoleQueryVo>): Promise<Fa.Ret<Fa.Page<Rbac.RbacUserRoleRetVo>>> => this.post('pageVo', params);
```

## 批量导入或 Upsert

Excel 导入或批量 upsert 默认流程：

1. 使用 `FaExcelUtils.simpleRead` 把行数据读入 VO/entity 列表。
2. 按最小必要业务 key 或时间范围一次性查询数据库已有数据。
3. 基于已有数据构建 `Map<BusinessKey, Entity>`。
4. 将导入数据拆分为新增列表和更新列表。
5. 使用 `saveBatch(saveList)` 和 `updateBatchById(updateList)`。

大批量数据优先使用 Map 查找，避免反复 `CollUtil.findOne`。如果 `saveBatch` 很慢，检查 JDBC URL 是否包含 `rewriteBatchedStatements=true`。

## Excel 分页工具

数据库分页写入 Excel 时优先使用已有工具：

```java
FaExcelUtils.writeExcelPage(fileName, RbacMenu.class, rbacMenuBiz.lambdaQuery(), i -> i);
```

需要自定义 sheet 写入时，可结合 `FaDbUtils.loopPage(...)` 和 EasyExcel writer。

## MyBatis-Plus JSON 字段

JSON 字段需要在 `@TableName` 上加 `autoResultMap = true`，并使用 `UniversalJsonTypeHandler`。JSON array 字段按项目文档使用数组类型，例如 `Tag[]`，不要使用 `List<Tag>`。

```java
@TableName(value = "demo_student", autoResultMap = true)
public class Student extends BaseDelEntity {
    @TableField(typeHandler = UniversalJsonTypeHandler.class)
    @ExcelProperty("标签")
    private Tag[] tags;
}
```

JSON SQL 与租户拦截器组合时要谨慎；项目文档中提到部分 `JSON_CONTAINS` 写法可能受当前 JSQLParser/MyBatis-Plus 组合影响而报错。

## 动态表后缀

动态表名后缀查询时，在同一线程中设置并清理 `BaseContextHandler`：

```java
BaseContextHandler.setTableSuffix("1");
IotDevice iotDevice = iotDeviceBiz.getById(1);
BaseContextHandler.setTableSuffix("");
```

操作结束后必须清理后缀，避免同线程后续查询误用该后缀。

## 拦截器忽略

只有明确需要时才使用 MyBatis-Plus `@InterceptorIgnore`，例如某个 Mapper 方法需要绕过全表删除拦截器：

```java
public interface StudentMapper extends FaBaseMapper<Student> {
    @InterceptorIgnore(blockAttack = "true")
    int deleteAll();
}
```

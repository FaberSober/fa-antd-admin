# 数据访问与自定义后端逻辑

归并自 `page.md`、`pagination.md`、`db.md`、`mybatisplus.md`、`dbDynamic.md`、`tdengine.md` 和 `geo.md`。

## 目录

- 自定义分页
- 批量写入与 Upsert
- MyBatis-Plus JSON 字段
- 强制更新 null
- 动态表名
- 动态数据源
- 地理数据与 TDengine

## 自定义分页

基类 `/page` 无法满足联表、聚合或 VO 查询时，使用 `BasePageQuery<ReqVo>`、PageHelper、Mapper 查询和 `TableRet`。

Controller 保持转发：

```java
@FaLogOpr(value = "检索文件分页", crud = LogCrudEnum.R)
@LogNoRet
@PostMapping("/queryFilePage")
public TableRet<StoreFile> queryFilePage(@RequestBody BasePageQuery<StoreFileQueryVo> params) {
    return baseBiz.queryFilePage(params);
}
```

Biz 负责启动分页并调用 Mapper：

```java
public TableRet<StoreFile> queryFilePage(BasePageQuery<StoreFileQueryVo> query) {
    PageInfo<StoreFile> info = PageHelper.startPage(query.getCurrent(), query.getPageSize())
            .doSelectPageInfo(() -> baseMapper.queryFile(query.getQuery(), query.getSorter()));
    return new TableRet<>(info);
}
```

- `PageHelper.startPage(...)` 必须紧邻实际查询。
- 排序参数沿用项目 sorter 解析，不直接拼接未校验的前端字段。
- 返回 VO 时同步检查 Mapper XML result mapping 和前端 service 类型。

## 批量写入与 Upsert

导入或批量 upsert 使用集合化流程：

1. 校验并规范化输入，空集合直接结束。
2. 按业务 key 或最小时间范围一次性查询已有数据。
3. 构造 `Map<BusinessKey, Entity>`，不要在循环中反复查库或使用 O(n²) 的列表扫描。
4. 将输入拆成新增和更新集合；更新时保留数据库主键及不应覆盖的字段。
5. 分别调用 `saveBatch(...)` 和 `updateBatchById(...)`，按数据量决定是否分块。
6. 业务要求原子性时在 Biz 方法上使用项目当前事务注解。

批量插入慢时检查 MySQL JDBC URL 是否已启用 `rewriteBatchedStatements=true`；不要仅为这个问题在每个 Mapper 重复编写批量 SQL。Excel 导入细节见 [excel.md](excel.md)。

## MyBatis-Plus JSON 字段

JSON 字段在 `@TableName` 上添加 `autoResultMap = true`，字段使用项目的 `UniversalJsonTypeHandler`。JSON array 按当前项目约定使用数组类型，不使用 `List<T>`。

```java
@TableName(value = "demo_student", autoResultMap = true)
public class Student extends BaseDelEntity {
    @TableField(typeHandler = UniversalJsonTypeHandler.class)
    private Tag[] tags;
}
```

MySQL 5.7 可使用 `->`、`JSON_CONTAINS`、`JSON_OBJECT` 等 JSON 函数，但自定义 SQL 必须实测。历史文档记录的 JSQLParser/MyBatis-Plus 组合可能无法解析部分 `JSON_CONTAINS(...)` 条件，尤其与租户拦截器组合时；以当前依赖版本和相关测试为准，不为绕过单条查询擅自升级解析器。

## 强制更新 null

MyBatis-Plus 默认可能忽略 `null` 字段。只有业务明确要求将数据库列清空时使用：

```java
@TableField(updateStrategy = FieldStrategy.ALWAYS)
private Date planProdDate;
```

先评估该策略对所有更新入口的影响；只影响单次更新时优先使用显式 UpdateWrapper/Mapper SQL。

## 动态表名

在同一线程设置 `BaseContextHandler` 表后缀，并确保结束后清理。使用 `try/finally` 防止异常导致线程复用时污染后续查询：

```java
BaseContextHandler.setTableSuffix("1");
try {
    return iotDeviceBiz.getById(id);
} finally {
    BaseContextHandler.setTableSuffix("");
}
```

表后缀必须来自受控值，不直接接受未校验的请求字符串。

## 动态数据源

仅在任务明确需要多数据源时使用项目当前 dynamic-datasource 方案：

- 先确认父 POM 是否已有 starter 和版本管理，不重复声明版本。
- 在目标环境配置中添加数据源，凭证使用环境变量或密钥管理，不把真实密码写入仓库或 reference。
- 使用 `@DS("dataSourceName")` 标注 Service/Biz 或方法，命名与配置完全一致。
- 明确默认数据源、严格匹配策略、事务边界和跨数据源调用限制。
- 测试实际连接、路由和失败行为；不要复制历史文档中的主机、账号或密码。

## 地理数据与 TDengine

- 经纬度列通常使用 `decimal(11,8)`；确认业务覆盖范围、精度和坐标系后再定字段。
- MySQL 距离计算可参考仓库历史 `lat_lng_distance` 函数，但新增数据库函数前确认部署权限、单位和索引方案。
- TDengine 任务先读取当前模块 Service/Mapper、驱动和连接配置，再使用 `@DS` 路由。
- 超级表（STable）的 timestamp、普通列和 TAGS 要分开建模；库的 `PRECISION`、`KEEP`、`DURATION`、`BUFFER` 必须来自实际保留与写入需求。
- TDengine SQL 和驱动 API 以仓库锁定版本为准，不把普通 MySQL/MyBatis-Plus 假设直接套用。

## 拦截器忽略

只有确认某个 Mapper 方法必须绕过指定保护时才使用 `@InterceptorIgnore`，并精确指定单项：

```java
public interface StudentMapper extends FaBaseMapper<Student> {
    @InterceptorIgnore(blockAttack = "true")
    int deleteAll();
}
```

绕过租户、全表更新/删除等保护属于高风险改动，必须检查调用入口和数据范围。

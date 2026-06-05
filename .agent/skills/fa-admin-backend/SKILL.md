---
name: fa-admin-backend
description: FA Admin backend development conventions for this repository. Use when Codex needs to add or modify Java/Spring Boot backend modules, CRUD APIs, entities, mappers, Biz classes, controllers, MyBatis-Plus code, validation, enums, dictionary fields, pagination endpoints, Excel import/export behavior, or MySQL 5.7 DDL/version scripts in zj-assets-manage-api.
---

# FA Admin 后端

## 概览

后端开发默认遵循本仓库“基类继承 + 薄 Controller”的风格，以及 MySQL 5.7 兼容的 DDL 规范。优先复用 `fa-core`、`fa-base` 已有抽象和相邻模块写法，不自行发明新的 API 形态、响应结构或表结构命名体系。

## 开始前

1. 修改前先查看最接近的现有模块。通用示例看 `fa-demo`，基类能力看 `fa-core`，具体风格看目标模块相邻代码。
2. 先判断任务类型：普通 CRUD、树形 CRUD、自定义查询/业务逻辑，还是纯 DDL。
3. 优先复用基础能力：`BaseController`、`BaseTreeController`、`BaseBiz`、`BaseTreeBiz`、`FaBaseMapper`、`QueryParams`、`Ret<T>`、`TableRet<T>`。
4. 自定义业务逻辑优先放在 Biz 层。Controller 只做输入输出路由时保持轻薄，不要在子 Controller 里重复实现基类已有 CRUD 接口。
5. 写 DDL 前，先对比 `fa-base/src/main/resources/sql/fa-base` 下相似表，尤其是 `1.0.0_base_ddl.sql`，再决定主键、审计字段、命名、索引和字符集。

## 后端 CRUD 分层

标准业务对象使用四层结构：

- `entity`：MyBatis-Plus 表映射、查询注解、树结构注解、Excel 注解、字典注解。
- `mapper`：MyBatis Mapper，通常继承 `FaBaseMapper<Entity>`。
- `biz`：普通表继承 `BaseBiz<Mapper, Entity>`；树形表继承 `BaseTreeBiz<Mapper, Entity>`。
- `rest`：普通表继承 `BaseController<Biz, Entity, Key>`；树形表继承 `BaseTreeController<Biz, Entity, Key>`。

最小 Controller 形态：

```java
@FaLogBiz("业务名称")
@RestController
@RequestMapping("/api/模块/业务/资源")
public class XxxController extends BaseController<XxxBiz, Xxx, Integer> {
}
```

树形资源使用 `BaseTreeController<XxxBiz, Xxx, Key>`，并在实体上补充树形注解。`@RestController` 还是 `@Controller` 优先跟随同模块相邻 Controller。

## API 与响应

API 路径使用 `/api/大模块/业务模块/实体` 结构。已有基础分组包括 `/api/base/xxx` 核心接口、`/api/tenant/xxx` 多租户接口。

需求能被基类覆盖时直接复用基类端点。普通 `BaseController` 已提供 `/save`、`/update`、`/remove/{id}`、`/getById/{id}`、`/page`、`/list`、`/exportExcel`、`/importExcel` 以及批量、mine、永久删除等接口。`BaseTreeController` 额外提供树路径、当前层级、全树、子树、排序调整、上移、下移等接口。

新增自定义接口时：

- 查询请求体按场景使用 `QueryParams` 或 `BasePageQuery<ReqVo>`。
- 返回 `Ret<T>` 或 `TableRet<T>`，Controller 中使用基类 `ok(...)` 返回成功结果。
- 大结果/查询类接口加 `@LogNoRet`；基类未覆盖的操作按需加 `@FaLogOpr`。
- 创建、更新等实体校验场景使用项目校验分组，例如 `Vg.Crud.C`、`Vg.Crud.U`。

## DDL 默认规则

SQL 默认兼容 MySQL 5.7。建表使用 `CREATE TABLE IF NOT EXISTS`、`ENGINE=InnoDB`，字符集优先 `utf8mb4`。默认不添加数据库外键约束。

不要把所有新表主键强制改成 `BIGINT AUTO_INCREMENT`，应对齐相似表：

- 配置、字典、菜单、角色、日志类表常见 `int(11)` 或 `int(11) unsigned AUTO_INCREMENT`。
- 用户、部门、文件等相关 ID 常见 `varchar(32)`。
- 关联字段类型必须匹配被关联现有表的真实主键类型。

普通业务表通常包含标准审计字段，包括 `deleted tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除'`。完整审计字段 SQL 和 DDL 细则见 [references/ddl.md](references/ddl.md)。

## 实体细节

实体使用 `@TableName`、`@TableId`，普通逻辑删除业务表通常继承 `BaseDelEntity`。只有需要参与通用查询解析的字段才添加 `@SqlEquals` 等查询注解。

字典字段使用 `@FaColDict("dict_code")`；`BaseController.page`/`BaseBiz.selectPageByQuery` 会把字典数据返回给前端。Excel 字段沿用现有 EasyExcel 注解和工具类。

枚举字段在实体中直接声明为枚举类型，不要为了方便退化成 `Integer`，除非是在匹配历史设计。详见 [references/entity-enum-dict.md](references/entity-enum-dict.md)。

## 自定义查询与批量逻辑

非标准分页使用 PageHelper 配合 `BasePageQuery<ReqVo>`，返回 `new TableRet<>(info)`。导入或批量 upsert 逻辑应先一次性查询已有数据，按业务 key 建立 Map，再拆分 `saveBatch` 和 `updateBatchById`。

分页、自定义批量逻辑、MyBatis-Plus JSON 字段、动态表后缀、强制更新 null、Excel 分页导出等细节见 [references/custom-logic.md](references/custom-logic.md)。

## 验证

完成后运行最小必要检查：可行时编译目标模块，有测试则运行相关测试；至少检查生成代码的 import、泛型 Key 类型、路径和基类继承是否一致。纯 DDL 修改要确认 MySQL 5.7 兼容性，并和相邻脚本对比命名、索引、字符集风格。

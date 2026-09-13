# CRUD、分层与 API

归并自 `api.md`、`common.md`、`dir.md`、`annotation.md`、`log.md`，并结合仓库当前基类与示例整理。

## 开始前

1. 搜索目标模块相邻的 Entity、Mapper、Biz、Controller，优先复制其命名、注解和包结构。
2. 判断资源属于普通 CRUD、树形 CRUD，还是必须新增自定义业务接口。
3. 打开对应基类确认当前签名和已有端点，不凭历史文档记忆重复实现。

## 标准分层

标准业务对象采用四层结构：

- `entity`：数据库映射、查询、树结构、Excel、字典等字段注解。
- `mapper`：通常继承 `FaBaseMapper<Entity>`。
- `biz`：普通表继承 `BaseBiz<Mapper, Entity>`；树形表继承 `BaseTreeBiz<Mapper, Entity>`。
- `rest`：普通表继承 `BaseController<Biz, Entity, Key>`；树形表继承 `BaseTreeController<Biz, Entity, Key>`。

保持 Controller 轻薄。自定义查询、事务、批处理和业务编排放入 Biz；SQL 放入 Mapper/XML。基类已覆盖的接口不要在子 Controller 中重写。

普通资源的最小形态：

```java
@FaLogBiz("业务名称")
@RestController
@RequestMapping("/api/module/biz/resource")
public class XxxController extends BaseController<XxxBiz, Xxx, Integer> {
}
```

树形资源改为 `BaseTreeController<XxxBiz, Xxx, Key>`，并按 [entity-enum-dict.md](entity-enum-dict.md) 配置树形实体。根节点 ID 默认为 `0`。`@RestController` 或 `@Controller` 跟随同模块先例。

## API 与响应

路径使用 `/api/大模块/业务模块/实体/操作`。基础接口常见 `/api/base/xxx`，多租户接口常见 `/api/tenant/xxx`。

- 标准 CRUD 直接继承当前 `BaseController`/`BaseTreeController` 能力。
- 自定义查询请求按相邻接口使用 `QueryParams` 或 `BasePageQuery<ReqVo>`。
- 返回项目统一的 `Ret<T>` 或 `TableRet<T>`；Controller 成功响应优先使用基类 `ok(...)`。
- Controller 泛型 `Key`、Entity 主键 Java 类型和 DDL 类型必须一致。
- 不发明新的响应包裹、分页结构或路径命名。

## 日志与过滤注解

- Controller 类使用 `@FaLogBiz` 标识业务域。
- 基类未覆盖的操作按需使用 `@FaLogOpr`，并选择正确的 `LogCrudEnum`。
- 分页、大列表和大响应查询使用 `@LogNoRet`，避免把完整返回体写入系统日志。
- 需要按模式清理缓存时先搜索现有 `@FaCacheClear` 用法；缓存规范见 [cache-concurrency.md](cache-concurrency.md)。
- SSE/流式接口的过滤器规则见 [messaging-realtime.md](messaging-realtime.md)。

## 检查清单

- 包路径、Bean 名、请求路径是否与目标模块一致。
- 是否误写了基类已有端点。
- 自定义逻辑是否留在 Biz/Mapper，而不是堆在 Controller。
- 主键泛型、返回类型、日志注解和校验分组是否正确。
- 树形资源是否使用树形基类、树形注解和根节点约定。

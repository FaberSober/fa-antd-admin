# Java 工具与外部集成

归并自 `springboot.md`、`apiForest.md`、`reflect.md`、`list.md`、`array.md`、`java8.md`、`jwt.md`、`jackson.md` 和 `ref.md`。

## Spring 请求与环境

只有无法通过 Controller 参数或依赖注入获取时，才从当前线程读取 request/response：

```java
ServletRequestAttributes attrs =
        (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
HttpServletRequest request = attrs != null ? attrs.getRequest() : null;
HttpServletResponse response = attrs != null ? attrs.getResponse() : null;
```

调用方处理无 Web 请求上下文的情况；异步线程通常没有这些属性。当前 active profile 可使用 `SpringUtil.getActiveProfile()`，但业务逻辑不应大量依赖 profile 分支，环境差异优先放入配置。

## Forest 外部 API

仓库已使用 Forest 时，优先定义声明式接口，不在业务代码中散落 HTTP 拼接。

```java
public interface IpService {
    @Get("${ip.service.url}?ip={0}&json=true")
    IpAddr query(String ip);
}
```

```java
@Address(basePath = "#{remote.api.base-url}")
@Headers("Authorization: Bearer #{remote.api.token}")
public interface RemoteService {
    @Post("datasets")
    JSONObject create(@JSONBody("name") String name);

    @Post("datasets/{datasetId}/documents")
    JSONObject upload(@Var("datasetId") String datasetId, @DataFile("file") File file);
}
```

- base URL、token、超时和代理来自配置，不硬编码环境地址或凭证。
- 为非 2xx、超时、重试、限流、响应反序列化和日志脱敏定义行为。
- 查询接口可按稳定性缓存，但必须设置合理 TTL 和失败策略。
- 外部 API DTO 与内部 Entity 分离，避免对方字段变化污染持久化模型。

## 集合与 Stream

- 排序优先 `Comparator.comparing(...)`，字段可能为 null 时显式使用 `nullsFirst/nullsLast`。
- 查找单个对象可使用 Hutool `CollUtil.findOne(...)`；批量匹配应先构造 Map，避免在 stream 中反复线性扫描。
- 分组使用 `Collectors.groupingBy(...)`；若输出顺序有要求，显式提供 `LinkedHashMap` supplier。
- `findFirst().orElse(...)` 仅在默认值符合业务语义时使用；必需数据缺失应抛出明确业务异常。
- 不在 stream 中隐藏数据库写入、远程调用等副作用。

## 泛型与反射

通过 `getGenericSuperclass()` 获取泛型参数只适用于实际父类仍保留 `ParameterizedType` 的场景。Spring 代理、多层继承、接口泛型和擦除都会让直接强转失败。优先复用 Spring `ResolvableType` 或仓库已有工具，并对无法解析给出明确异常。

不要用 `new ArrayList<T>().getClass().getGenericSuperclass()` 推导元素 `T`；运行时只会得到容器实现类的泛型父类信息。需要携带类型时使用显式 `Class<T>`、Jackson `TypeReference<T>` 或等价 type token。

## Jackson 与 JWT

全局 Jackson 规则见 [entity-enum-dict.md](entity-enum-dict.md)。修改转换器前确认不会覆盖 Spring Boot 自动配置和仓库现有 Long、日期、时区策略。

JWT 调试只解码非敏感测试 token。线上 token 不发送到第三方在线工具、不写日志、不提交仓库。解码不等于验签；服务端必须校验签名、有效期、issuer/audience 等当前安全策略。

## 外部资料使用原则

历史 `fa-core/doc/server` 中的博客和第三方链接仅作线索。实现前以仓库源码、锁定依赖版本和官方文档为准，不直接复制与当前 Jakarta/Spring Boot/MyBatis-Plus 版本不匹配的示例。

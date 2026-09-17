# 实体、枚举、字典与校验

归并自 `common.md`、`validator.md`、`enum.md`、`dict.md`、`jackson.md` 和 `ref.md` 中与数据模型相关的内容。

## Entity

- 使用 `@TableName`；JSON type handler 场景添加 `autoResultMap = true`。
- 使用 `@TableId`，主键类型同时匹配 DDL、Mapper/Biz 和 Controller 泛型。
- 普通逻辑删除业务表优先继承 `BaseDelEntity`。
- 只有参与通用查询解析的字段才添加 `@SqlEquals` 等查询注解。
- 需要导入导出的字段按相邻实体添加 EasyExcel 注解。
- 只有将字段设为 `null` 也必须写回数据库时，才使用 `@TableField(updateStrategy = FieldStrategy.ALWAYS)`。
- 常用字段优先沿用仓库已有命名，如 `id`、`sort`、`status`、`description`、`remark`，不要因旧文档示例自行引入 `valid`、`info` 等字段。

树形实体按当前基类要求配置：

- `@SqlTreeId`
- `@SqlTreeName`
- `@SqlTreeParentId`
- `@SqlSorter`

树结构根节点 ID 默认为 `0`。字段类型、父子关系和排序字段以相邻树形实体为准。

## 枚举

参考 `fa-core/src/main/java/com/faber/core/enums/SexEnum.java`。默认约定：

- 类名使用 `XxxEnum`，放在对应模块的 `enums` 包。
- 默认实现 `IEnum<Integer>`；业务值天然是字符串时才使用 `IEnum<String>`。
- 整型枚举数据库字段通常使用 `tinyint(4)` 或目标表已有的兼容类型。
- 值字段命名为 `value`，展示字段命名为 `desc`。
- `value` 同时使用 `@JsonValue` 和 `@EnumValue`。
- 使用 Lombok `@Getter` 和 `private final` 字段。
- Entity 字段直接声明为枚举类型，不为省事退化成 `Integer`。
- 需要反查时实现 `fromValue(...)`、`fromDesc(...)`；非法输入抛出 `IllegalArgumentException`。

```java
@Getter
public enum XxxEnum implements IEnum<Integer> {
    NO(0, "否"),
    YES(1, "是");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    XxxEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }
}
```

## 字典

字典先在后台“系统管理/字典管理”维护，再在 Entity 字段上使用字典编码：

```java
@FaColDict("base_dict_test_options")
@ExcelProperty("字典值")
private String dictValue;
```

`BaseBiz.selectPageByQuery` 会解析 `@FaColDict`，将字典选项加入 `TableRet`。不要在每个业务接口重复查询同一字典。字典编码必须与初始化数据或后台配置一致。

## 校验

请求 VO 使用 Jakarta Validation 注解。基类 CRUD 创建/更新场景沿用项目分组，如 `Vg.Crud.C`、`Vg.Crud.U`；自定义接口是否添加 `@Valid`/`@Validated` 跟随当前 Controller 写法。

```java
@Data
public class XxxReqVo implements Serializable {
    @NotEmpty
    private List<Integer> factoryIds;

    @NotNull
    private Date dateStart;

    @NotNull
    private Date dateEnd;
}
```

校验约束表达输入契约，不用数据库异常代替必填、长度、范围或集合非空校验。

## Jackson 与字段命名

- 优先复用仓库当前 `ObjectMapper`/MVC 配置，不直接照搬历史 `WebMvcConfigurationSupport` 示例，以免覆盖 Spring Boot 自动配置。
- 若配置日期格式未生效，先检查当前 MVC 配置是否重建了 `MappingJackson2HttpMessageConverter`，再做最小修复。
- 连续大写或特殊命名字段序列化不符合接口契约时，显式使用 `@JsonProperty("expectedName")`。
- Long 转字符串、未知字段处理、时区等全局策略只能在确认全局影响后修改；局部需求优先使用字段级注解或 DTO。
- EasyExcel 模型使用链式 Accessor 前，检查当前 EasyExcel 版本兼容性和相邻导入导出模型。

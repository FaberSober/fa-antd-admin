# 实体、枚举、字典、校验

## 实体检查项

- 使用 `@TableName`；需要 JSON type handler 时加 `autoResultMap = true`。
- 使用 `@TableId`，主键类型要同时匹配 DDL 和 Controller 泛型。
- 普通逻辑删除业务表优先继承 `BaseDelEntity`。
- 只有需要参与通用查询解析的字段才添加 `@SqlEquals` 等查询注解。
- 需要导入导出的字段添加 EasyExcel 注解。
- 只有字段设置为 `null` 也必须强制更新时，才使用 `@TableField(updateStrategy = FieldStrategy.ALWAYS)`。

树形实体需要包含项目树形注解：

- `@SqlTreeId`
- `@SqlTreeName`
- `@SqlTreeParentId`
- `@SqlSorter`

## 枚举模式

参考 `fa-core/src/main/java/com/faber/core/enums/SexEnum.java` 和 `fa-core/doc/server/enum.md`。

默认枚举约定：

- 类名使用 `XxxEnum`，放在对应模块的 `enums` 包下。
- 默认实现 `IEnum<Integer>`；只有业务值天然是字符串时才使用 `IEnum<String>`。
- 数据库存储字段默认使用 `tinyint(4)` 或兼容的已有整型字段。
- 枚举值字段命名为 `value`，展示说明字段命名为 `desc`。
- `value` 同时标注 `@JsonValue` 和 `@EnumValue`。
- 使用 Lombok `@Getter`，字段使用 `private final`。
- 实体字段直接声明为枚举类型，例如 `private SexEnum sex;`。
- 需要反查时添加 `fromValue(...)`、`fromDesc(...)`，非法值抛出 `IllegalArgumentException`。

最小形态：

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

## 字典字段

字典在后台“系统管理/字典管理”中维护。Java 实体中对字典字段添加注解：

```java
@FaColDict("base_dict_test_options")
@ExcelProperty("字典值1")
private String dict1;
```

添加 `@FaColDict` 后，基类分页会把字典选项放入 `TableRet` 返回给前端。前端表格展示可使用 `BaseTableUtils.genDictSorterColumn(...)`。

## 校验

请求 VO 使用 Jakarta validation 注解。通过基类 CRUD 创建/更新实体时，沿用项目校验分组，例如 `Vg.Crud.C`、`Vg.Crud.U`。

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

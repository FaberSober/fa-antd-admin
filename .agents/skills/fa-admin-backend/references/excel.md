# Excel 导入导出

归并自 `excel.md`、`db.md`、`mybatisplus.md` 和 `ref.md` 中与 EasyExcel 相关的内容。

## 基础原则

- 标准 Entity 导入导出优先复用 `BaseController` 和项目现有 Excel 能力。
- 字段注解、日期/枚举转换、字典处理和文件响应跟随相邻模块。
- 导入模型可使用独立 VO，避免为了 Excel 格式污染持久化 Entity。
- 不把大数据集一次性加载到内存；导入与导出都按数据规模选择监听器、分批或分页。
- 使用 `@Accessors(chain = true)` 前验证当前 EasyExcel 版本对 Bean 属性识别的兼容性。

## 分页导出

数据库分页写入 Excel 优先使用封装：

```java
FaExcelUtils.writeExcelPage(
        fileName,
        RbacMenu.class,
        rbacMenuBiz.lambdaQuery(),
        item -> item
);
```

需要自定义 sheet、转换或多 sheet 时，使用 `FaDbUtils.loopPage(...)` 配合单个 `ExcelWriter`：

```java
try (ExcelWriter writer = EasyExcel.write(fileName, RbacMenu.class).build()) {
    WriteSheet sheet = EasyExcel.writerSheet().build();
    FaDbUtils.loopPage(
            rbacMenuBiz.lambdaQuery(),
            page -> writer.write(page.getList(), sheet),
            pageSize
    );
}
```

- `ExcelWriter` 使用 try-with-resources，保证异常时关闭。
- 同一个 sheet 只创建一次，不在分页回调中反复创建 writer/sheet。
- page size 按行宽、字段转换和内存实测，不照搬历史示例的 `10`。
- 导出路径、临时文件和下载响应使用仓库当前文件工具，不硬编码开发机绝对路径。

## 导入与 Upsert

简单读取可使用 `FaExcelUtils.simpleRead(...)`，在回调中完成行级基础校验和转换。复杂导入同时遵循 [custom-logic.md](custom-logic.md) 的批量 Upsert 规则：一次查询已有数据、构建 Map、拆分新增/更新集合、按批写入。

导入接口必须明确：

- 空行、重复业务 key、非法枚举/字典、日期格式和必填字段的处理。
- 是全量失败、部分成功，还是返回逐行错误；不要默默跳过错误。
- 更新时哪些字段允许覆盖，哪些数据库字段必须保留。
- 数据量上限、事务范围和失败回滚策略。

批量写入慢时确认 JDBC 是否启用 `rewriteBatchedStatements=true`，并检查实际 SQL/批次，而不是盲目增加批次大小。

## 验证

- 用最小样例覆盖中文、日期、枚举/字典、空值和错误行。
- 导出后确认表头、列顺序、格式和总行数。
- 大数据路径确认分页推进、内存占用和 writer 正常关闭。
- 导入确认新增/更新/重复/失败统计及事务行为。

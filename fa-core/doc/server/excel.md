# Excel
## 分页获取数据库然后写入Excel
参考代码：`com.faber.base.utils.FaDbUtilsTest`

示例代码1：
```java
String fileName = "/Users/xupengfei/tmp/testLoopPage.xlsx";

// 这里 需要指定写用哪个class去写
try (ExcelWriter excelWriter = EasyExcel.write(fileName, RbacMenu.class).build()) {
    // 这里注意 如果同一个sheet只要创建一次
    WriteSheet writeSheet = EasyExcel.writerSheet().build();

    // 根据数据库分页去调用写入
    FaDbUtils.loopPage(
            rbacMenuBiz.lambdaQuery(),
            pageInfo -> {
                log.debug("page: {}, isHasNextPage: {}, size: {}, pageSize: {}, total: {}", pageInfo.getPageNum(), pageInfo.isHasNextPage(), pageInfo.getSize(), pageInfo.getPageSize(), pageInfo.getTotal());
                List<RbacMenu> list = pageInfo.getList();
                excelWriter.write(list, writeSheet);
            },
            10
    );
}
```

示例代码2：
```java
String fileName = "/Users/xupengfei/tmp/testLoopPage.xlsx";
FaExcelUtils.writeExcelPage(fileName, RbacMenu.class, rbacMenuBiz.lambdaQuery(), i -> i);
```

# MyBatis-Plus
## JSON格式数据映射
参考文件：
1. `faber-admin/src/main/java/com/faber/api/demo/entity/Student.java`
2. `faber-admin/src/test/java/com/faber/demo/student/StudentTest.java`

> 如果是json array，在Bean中定义要使用Clazz[]数组格式，不能使用List<Clazz>格式，否则会报错。

Mybatis通用JsonTypeHandler: http://events.jianshu.io/p/0246df229a1f

实体Bean定义时注意以下几点
```java
// 要加入autoResultMap = true
@TableName(value = "demo_student", autoResultMap = true)
public class Student extends BaseDelEntity {
    // ...
    
    // 使用typeHandler = JacksonTypeHandler.class
    @TableField(typeHandler = JacksonTypeHandler.class)
    @ExcelProperty("标签")
    private Tag[] tags;

    @Data``
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Tag implements Serializable {
        private String name;
    }

}
```

## JSON格式数据查询
参考代码：`faber-admin/src/test/java/com/faber/demo/student/StudentTest.java`

### json array like query
```java
List<Student> list = new LambdaQueryChainWrapper<>(studentMapper)
    .apply("tags -> '$[*].name' LIKE CONCAT('%',{0},'%')", "新")
    .list();
```
```sql
SELECT * FROM demo_student WHERE tags -> '$[*].name' LIKE CONCAT( '%', '新', '%' );
```

### json object like query
```sql
SELECT * FROM demo_student WHERE info->'$.info1' LIKE CONCAT( '%', 'he', '%' );
```

### json array equal query
```sql
SELECT * FROM demo_student WHERE JSON_CONTAINS(tags, JSON_OBJECT('name', '新生'));
```

### json object equal query
```sql
SELECT * FROM demo_student WHERE info->'$.info1' = 'hello';
```

## 报错
JsonArray查询，如果和多租户插件一起用，查询会报错。

git issue上也有类似问题：
- https://github.com/baomidou/mybatis-plus/issues/4966
- https://github.com/JSQLParser/JSqlParser/issues/1504

本地报错信息如下：
```
Caused by: com.baomidou.mybatisplus.core.exceptions.MybatisPlusException: Failed to process, Error SQL: SELECT  id,`name`,`age`,`sex`,`email`,`birthday`,`valid`,`info_id`,`tenant_id`,tags,info,upd_time,upd_user,upd_name,upd_host,crt_time,crt_user,crt_name,crt_host  FROM demo_student 
 WHERE  deleted=false

AND (JSON_CONTAINS(tags, JSON_OBJECT('name', ?)) AND id = ?)
	at com.baomidou.mybatisplus.core.toolkit.ExceptionUtils.mpe(ExceptionUtils.java:39)
	at com.baomidou.mybatisplus.extension.parser.JsqlParserSupport.parserSingle(JsqlParserSupport.java:52)
	at com.baomidou.mybatisplus.extension.plugins.inner.TenantLineInnerInterceptor.beforeQuery(TenantLineInnerInterceptor.java:65)
	at com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor.intercept(MybatisPlusInterceptor.java:78)
	at org.apache.ibatis.plugin.Plugin.invoke(Plugin.java:62)
	at com.sun.proxy.$Proxy206.query(Unknown Source)
	at com.github.pagehelper.PageInterceptor.intercept(PageInterceptor.java:132)
	at org.apache.ibatis.plugin.Plugin.invoke(Plugin.java:62)
	at com.sun.proxy.$Proxy206.query(Unknown Source)
	at org.apache.ibatis.session.defaults.DefaultSqlSession.selectList(DefaultSqlSession.java:151)
	... 47 more
Caused by: net.sf.jsqlparser.parser.ParseException: Encountered unexpected token: "(" "("
    at line 4, column 19.

Was expecting one of:

    "&"
    "&&"
    ")"
    "::"
    "<<"
    ">>"
    "AND"
    "AT"
    "COLLATE"
    "OR"
    "XOR"
    "["
    "^"
    "|"

	at net.sf.jsqlparser.parser.CCJSqlParser.generateParseException(CCJSqlParser.java:30694)
	at net.sf.jsqlparser.parser.CCJSqlParser.jj_consume_token(CCJSqlParser.java:30527)
	at net.sf.jsqlparser.parser.CCJSqlParser.AndExpression(CCJSqlParser.java:9587)
	at net.sf.jsqlparser.parser.CCJSqlParser.OrExpression(CCJSqlParser.java:9456)
	at net.sf.jsqlparser.parser.CCJSqlParser.XorExpression(CCJSqlParser.java:9434)
	at net.sf.jsqlparser.parser.CCJSqlParser.Expression(CCJSqlParser.java:9405)
	at net.sf.jsqlparser.parser.CCJSqlParser.WhereClause(CCJSqlParser.java:8708)
	at net.sf.jsqlparser.parser.CCJSqlParser.PlainSelect(CCJSqlParser.java:5459)
	at net.sf.jsqlparser.parser.CCJSqlParser.SetOperationList(CCJSqlParser.java:5645)
	at net.sf.jsqlparser.parser.CCJSqlParser.SelectBody(CCJSqlParser.java:5324)
	at net.sf.jsqlparser.parser.CCJSqlParser.Select(CCJSqlParser.java:5319)
	at net.sf.jsqlparser.parser.CCJSqlParser.SingleStatement(CCJSqlParser.java:232)
	at net.sf.jsqlparser.parser.CCJSqlParser.Statement(CCJSqlParser.java:153)
	at net.sf.jsqlparser.parser.CCJSqlParserUtil.parseStatement(CCJSqlParserUtil.java:188)
	at net.sf.jsqlparser.parser.CCJSqlParserUtil.parse(CCJSqlParserUtil.java:63)
	at net.sf.jsqlparser.parser.CCJSqlParserUtil.parse(CCJSqlParserUtil.java:38)
	at com.baomidou.mybatisplus.extension.parser.JsqlParserSupport.parserSingle(JsqlParserSupport.java:49)
	... 55 more
```

解决办法，引入最新版的jsqlparse：
```xml
<dependency>
    <groupId>com.github.jsqlparser</groupId>
    <artifactId>jsqlparser</artifactId>
    <version>4.5</version>
</dependency>
```

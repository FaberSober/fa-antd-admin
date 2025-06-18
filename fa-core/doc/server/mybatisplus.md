[TOC]

# MyBatis-Plus

## MyBatisPlus直接执行SQL


## MyBatisPlus批量写入方法saveBatch速度很慢的解决方案
解决方案很简单，在数据库配置的uri后面加上下面这个属性即可：
```yaml
rewriteBatchedStatements=true
```
加上之后发现，1w条数据入库也就在几百毫秒左右。
那么这个参数究竟是干什么用的呢，查阅了一下资料，得到下面这个描述：

> rewriteBatchedStatements 是 MySQL JDBC 驱动程序的一个参数，用于启用或禁用批量更新语句的优化。当该参数设置为 true 时，JDBC 驱动程序会将多个 SQL 语句封装成一条批量更新语句，从而提高更新操作的效率；而当该参数设置为 false 时，JDBC 驱动程序则会将多个 SQL 语句单独发送到数据库服务器，并逐一执行，这种方式比较耗费时间和资源。

相当于这个参数设置为true的时候，执行的sql是类似下面这种形式：

```sql
insert into t (…) values (…) , (…), (…)
```

所以，如果自己在xml中写批量插入语句也是可以解决这个问题，例如下面这个写法：

```sql
<insert id="insertUsers">
  INSERT INTO user (user_id, user_name)
  VALUES
  <foreach collection ="userList" item="user" separator =",">
    (#{user.userId}, #{user.userName})
  </foreach>
</insert>
```

这样的话，每个xml中都需要写这一段，不用代码生成工具的话，不太友好，所以MyBatisPlus中有一个InsertBatchSomeColumn方法

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

    @Data
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

下面代码会报错，需要升级jsqlparser 4.5就不会报错了。但是目前jsqlparser 4.5版本和mybatisplus同时使用有bug，所以只能使用4.4。放弃下面的查询方法。

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

# 分表查询（动态表名）
## 示例
```java
// 线程中设置表后缀
BaseContextHandler.setTableSuffix("1");
// 调用查询
IotDevice iotDevice = iotDeviceBiz.getById(1);
// 检查日志SQL，查询的表名称为：beam_iot_device_1
// 如果没有取消后缀，后续的查询表都会加上此后缀，一条线程中的查询
BaseContextHandler.setTableSuffix("");
```

# 拦截忽略注解 @InterceptorIgnore
https://baomidou.com/plugins/#%E6%8B%A6%E6%88%AA%E5%BF%BD%E7%95%A5%E6%B3%A8%E8%A7%A3-interceptorignore

实例代码如下：
```java
public interface StudentMapper extends FaBaseMapper<Student> {

    // 添加拦截忽略注解，指定忽略全表删除拦截器
    @InterceptorIgnore(blockAttack = "true")
    int deleteAll();

}
```

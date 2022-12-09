# MyBatis-Plus
## JSON格式数据映射
参考文件：
1. `faber-admin/src/main/java/com/faber/api/demo/entity/Student.java`
2. `faber-admin/src/test/java/com/faber/demo/student/StudentTest.java`

实体Bean定义时注意以下几点
```java
// 要加入autoResultMap = true
@TableName(value = "demo_student", autoResultMap = true)
public class Student extends BaseDelEntity {
    // ...
    
    // 使用typeHandler = JacksonTypeHandler.class
    @TableField(typeHandler = JacksonTypeHandler.class)
    @ExcelProperty("标签")
    private List<Tag> tags;

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

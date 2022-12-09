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
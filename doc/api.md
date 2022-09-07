# 常用代码整理
## enum枚举
```java
@ToString
@AllArgsConstructor
public enum Status {
    SENDING('1', "未接收"), 
    RECEIVED('2', "已接收");

    public final String value;
    public final String text;
}
```
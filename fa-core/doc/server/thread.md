# thread

## 线程池配置
配置项代码目录：`com.faber.core.config.thread.ThreadPoolConfig`

示例代码：`com.faber.base.thread.ThreadPoolTest`

```java
@Autowired
private Executor executor;

executor.execute(() -> {
    // 线程中执行
});
```

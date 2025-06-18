# Redis

## 同步锁示例
参考代码：
1. `fa-core\src\test\java\com\faber\core\redis\RedisTest.java`
2. `fa-base\src\test\java\com\faber\base\redis\RedisTest.java`

```java
@Test
public void testGetLock() {
    RLock lock = redisson.getLock("anyLock");
    // 最常见的使用方法
    lock.lock();
    lock.unlock();
}

@Test
public void testGetLock2() throws InterruptedException {
    RLock lock = redisson.getLock("anyLock2");
    // 加锁以后10秒钟自动解锁
    // 无需调用unlock方法手动解锁
    lock.lock(10, TimeUnit.SECONDS);

    // 尝试加锁，最多等待100秒，上锁以后10秒自动解锁
    boolean res = lock.tryLock(100, 10, TimeUnit.SECONDS);
    if (res) {
        try {
            log.info("get lock and run...");
        } finally {
            lock.unlock();
        }
    }
}
```

基于springboot自定义注解+redis实现分布式锁: https://www.cnblogs.com/miao-sir/p/15793001.html

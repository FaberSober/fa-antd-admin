# 缓存、Redis 与并发

归并自 `cache.md`、`redis.md`、`thread.md` 和 `annotation.md`。

## JetCache

需要实体缓存时跟随当前 Biz 的 JetCache 用法，让读、更新、删除保持一致：

```java
@Cached(name = "student:", key = "#id", expire = 3600)
@Override
public Student getById(Serializable id) {
    return super.getById(id);
}

@CacheUpdate(name = "student:", key = "#entity.id", value = "#entity")
@Override
public boolean updateById(Student entity) {
    return super.updateById(entity);
}

@CacheInvalidate(name = "student:", key = "#id")
@Override
public boolean removeById(Serializable id) {
    return super.removeById(id);
}
```

- 缓存 key 使用稳定业务前缀和唯一标识，段之间用 `:`；先搜索现有 key，避免同义多套命名。
- 固定 key 的 SpEL 写法跟随当前项目示例，不自行拼接不受控输入。
- TTL、空值缓存、本地/远程层级、序列化方式依据数据一致性和访问量决定。
- 新增缓存时同时覆盖创建、更新、删除和批量变更入口；不能保证一致性时不要缓存。
- `@FaCacheClear` 会按模式批量清理 Redis key，使用前收紧匹配范围，避免跨业务误删。

## Redis 分布式锁

使用当前 Redisson Bean。优先 `tryLock(waitTime, leaseTime, unit)`，并只在本线程确实持有锁时释放：

```java
RLock lock = redisson.getLock(lockKey);
boolean locked = lock.tryLock(5, 30, TimeUnit.SECONDS);
if (!locked) {
    throw new IllegalStateException("业务处理中，请稍后重试");
}
try {
    runCriticalSection();
} finally {
    if (lock.isHeldByCurrentThread()) {
        lock.unlock();
    }
}
```

- key 必须包含足以隔离竞争范围的业务标识，但不得包含秘密或超长原始载荷。
- `leaseTime` 覆盖合理最长执行时间；依赖 watchdog 时确认当前调用方式和配置。
- 锁内只放必须串行的工作，避免长时间网络调用。
- 分布式锁不替代数据库唯一约束、乐观锁或幂等设计。

## 线程池

优先注入仓库 `com.faber.core.config.thread.ThreadPoolConfig` 提供的 `Executor`，不要临时创建无界线程池：

```java
@Resource
private Executor executor;

executor.execute(() -> runTask());
```

异步任务必须考虑异常记录、拒绝策略、关闭行为和上下文传播。`BaseContextHandler`、租户、用户、动态表名等 ThreadLocal 上下文不会天然安全传播；需要时显式捕获/恢复，并在 `finally` 清理。事务也不会自动跨线程传播。

## 检查清单

- 缓存 key、TTL、更新/删除失效路径是否完整。
- 锁粒度、等待/租约、异常释放和幂等是否正确。
- 异步任务是否丢失租户/用户上下文或异常。
- 是否误把真实凭证、token 或完整个人数据放入 key/value/log。

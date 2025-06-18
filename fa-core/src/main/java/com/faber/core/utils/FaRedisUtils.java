package com.faber.core.utils;

import lombok.Getter;
import org.redisson.api.RBucket;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

/**
 * redis帮助类
 * @author Farando
 * @date 2023/3/6 14:20
 * @description
 */
@Getter
@Component
public class FaRedisUtils {

    @Autowired
    private RedissonClient redisson;

    @Value("${spring.data.redis.prefix}")
    private String redisPrefix;

    public String buildKey(String key) {
        return redisPrefix + ":" + key;
    }

    public void set(String key, String value) {
        RBucket<String> bucket = redisson.getBucket(buildKey(key));
        bucket.set(value);
    }

    public void set(String key, String value, long timeToLive, TimeUnit timeUnit) {
        RBucket<String> bucket = redisson.getBucket(buildKey(key));
        if (timeToLive < 0) {
            bucket.set(value);
        } else {
            bucket.set(value, timeToLive, timeUnit);
        }
    }

    public String getStr(String key) {
        RBucket<String> bucket = redisson.getBucket(buildKey(key));
        return bucket.get();
    }

    public boolean del(String key) {
        RBucket<String> bucket = redisson.getBucket(buildKey(key));
        return bucket.delete();
    }

    public RLock getLock(String key) {
        return redisson.getLock(buildKey("lock:" + key));
    }

}

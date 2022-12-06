package com.faber.common.redis;

import org.redisson.Redisson;
import org.redisson.api.RAtomicLong;
import org.redisson.api.RMap;
import org.redisson.api.RStream;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.junit.Test;

import java.time.Duration;

/**
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/6 17:00
 */
public class RedisTest {

    protected RedissonClient getRedissonClient() {
        // 1. Create config object
        Config config = new Config();
        config.useSingleServer()
                // use "rediss://" for SSL connection
                .setAddress("redis://127.0.0.1:6379");
        return Redisson.create(config);
    }

    @Test
    public void testHello() {
        RedissonClient client = getRedissonClient();
        RMap<String, String> map = client.getMap("anyMap");
        map.put("foo", "bar1");
        map.expire(Duration.ofSeconds(30));
    }

    @Test
    public void testHello1() {
        RedissonClient client = getRedissonClient();
        RAtomicLong rAtomicLong = client.getAtomicLong("anyLong");
        rAtomicLong.set(222222);
        rAtomicLong.expire(Duration.ofSeconds(30));
    }

}

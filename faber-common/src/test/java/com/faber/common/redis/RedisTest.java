package com.faber.common.redis;

import lombok.extern.slf4j.Slf4j;
import org.junit.Before;
import org.redisson.Redisson;
import org.redisson.api.*;
import org.redisson.api.listener.MessageListener;
import org.redisson.config.Config;
import org.junit.Test;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

/**
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/6 17:00
 */
@Slf4j
public class RedisTest {

    private RedissonClient redisson;

    protected RedissonClient getRedissonClient() {
        // 1. Create config object
        Config config = new Config();
        config.useSingleServer()
                // use "rediss://" for SSL connection
                .setAddress("redis://127.0.0.1:6379")
                .setPassword("fa@redis#1276");
        return Redisson.create(config);
    }

    @Before
    public void init() {
        redisson = getRedissonClient();
    }

    @Test
    public void testGetConfig() throws IOException {
        Config config = redisson.getConfig();
        String yaml = config.toYAML();
        System.out.println(yaml);
    }

    @Test
    public void testString() {
        RBucket<String> bucket = redisson.getBucket("myBucket");
        bucket.setAsync("Hello");
        log.info(bucket.get());
    }

    @Test
    public void testObj() {
        RBucket<CustomMessage> bucket = redisson.getBucket("myBucketObj");
        bucket.setAsync(new CustomMessage("hello 123"));
        log.info(bucket.get().toString());
    }

    @Test
    public void testMap() {
        RedissonClient client = getRedissonClient();
        RMap<String, String> map = client.getMap("anyMap");
        map.put("foo", "bar1");
        map.put("foo2", "bar2");
//        map.expire(Duration.ofSeconds(30));
    }

    @Test
    public void testKeys() {
        RKeys keys = redisson.getKeys();

        Iterable<String> allKeys = keys.getKeys();
        allKeys.forEach(log::debug);

        Iterable<String> foundedKeys = keys.getKeysByPattern("my*");
        long numOfDeletedKeys = keys.delete("obj1", "obj2", "obj3");
        long deletedKeysAmount = keys.deleteByPattern("test?");
        String randomKey = keys.randomKey();
        long keysAmount = keys.count();
    }

    @Test
    public void testLong() {
        RedissonClient client = getRedissonClient();
        RAtomicLong rAtomicLong = client.getAtomicLong("anyLong");
        rAtomicLong.set(222222);
        rAtomicLong.expire(Duration.ofSeconds(30));
    }

    @Test
    public void testTopic() throws InterruptedException {
        CountDownLatch countDownLatch = new CountDownLatch(1);

        {
            RTopic topic = redisson.getTopic("anyTopic");
            topic.addListener(CustomMessage.class, new MessageListener<CustomMessage>() {
                @Override
                public void onMessage(CharSequence charSequence, CustomMessage customMessage) {
                    log.info("topic received: " + customMessage);
                    countDownLatch.countDown();
                }
            });
        }

        // 在其他线程或JVM节点
        {
            RTopic topic = redisson.getTopic("anyTopic");
            long clientsReceivedMessage = topic.publish(new CustomMessage("hello"));
        }

        boolean b = countDownLatch.await(10, TimeUnit.SECONDS);
        log.info("b: " + b);
    }

}

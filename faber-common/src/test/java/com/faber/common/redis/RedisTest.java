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

    private RedissonClient client;

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
        client = getRedissonClient();
    }

    @Test
    public void testGetConfig() throws IOException {
        Config config = client.getConfig();
        String yaml = config.toYAML();
        System.out.println(yaml);
    }

    @Test
    public void testAtomicLong() {
        RAtomicLong myLong = client.getAtomicLong("myLong");
        myLong.set(88888888L);
        RFuture<Boolean> isSet = myLong.compareAndSetAsync(6, 27);
        isSet.handle((result, exception) -> {
            // handle the result or exception here.
            System.out.println(result);
            return result;
        });
    }

    @Test
    public void testString() {
        RSetCache<String> cache = client.getSetCache("anyStr");
        cache.add("foo");
    }

    @Test
    public void testHello() {
        RedissonClient client = getRedissonClient();
        RMap<String, String> map = client.getMap("anyMap");
        map.put("foo", "bar1");
        map.put("foo2", "bar2");
//        map.expire(Duration.ofSeconds(30));
    }

    @Test
    public void testHello1() {
        RedissonClient client = getRedissonClient();
        RAtomicLong rAtomicLong = client.getAtomicLong("anyLong");
        rAtomicLong.set(222222);
        rAtomicLong.expire(Duration.ofSeconds(30));
    }

    @Test
    public void testTopic() throws InterruptedException {
        CountDownLatch countDownLatch = new CountDownLatch(1);

        {
            RTopic topic = client.getTopic("anyTopic");
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
            RTopic topic = client.getTopic("anyTopic");
            long clientsReceivedMessage = topic.publish(new CustomMessage("hello"));
        }

        boolean b = countDownLatch.await(10, TimeUnit.SECONDS);
        log.info("b: " + b);
    }

}

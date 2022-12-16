package com.faber.core.redis;

import cn.hutool.core.thread.ThreadUtil;
import lombok.extern.slf4j.Slf4j;
import org.junit.Before;
import org.junit.Test;
import org.redisson.Redisson;
import org.redisson.api.*;
import org.redisson.api.listener.MessageListener;
import org.redisson.config.Config;

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
        RBucket<String> bucket = redisson.getBucket("test:myBucket");
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

    @Test
    public void testRateLimiter() throws InterruptedException {
        RRateLimiter rateLimiter = redisson.getRateLimiter("myRateLimiter");
        rateLimiter.delete();
        rateLimiter = redisson.getRateLimiter("myRateLimiter");
        // 初始化
        // 最大流速 = 每5秒钟产生2个令牌
        rateLimiter.trySetRate(RateType.OVERALL, 2, 5, RateIntervalUnit.SECONDS);

        // 测试场景，现在需要11个令牌，立刻获取
        CountDownLatch latch = new CountDownLatch(11);

        // 实际获取的过程如下，可以看出每5s中只会获取2个令牌
        //15:36:11.813 [main] INFO com.faber.common.redis.RedisTest - GET pass token 1
        //15:36:11.818 [main] INFO com.faber.common.redis.RedisTest - GET pass token 2
        //15:36:11.822 [main] INFO com.faber.common.redis.RedisTest - GET pass token 3
        //15:36:16.832 [main] INFO com.faber.common.redis.RedisTest - GET pass token 4
        //15:36:16.835 [main] INFO com.faber.common.redis.RedisTest - GET pass token 5
        //15:36:21.845 [main] INFO com.faber.common.redis.RedisTest - GET pass token 6
        //15:36:21.849 [main] INFO com.faber.common.redis.RedisTest - GET pass token 7
        //15:36:26.858 [main] INFO com.faber.common.redis.RedisTest - GET pass token 8
        //15:36:26.861 [main] INFO com.faber.common.redis.RedisTest - GET pass token 9
        //15:36:31.865 [main] INFO com.faber.common.redis.RedisTest - GET pass token 10
        //15:36:31.868 [main] INFO com.faber.common.redis.RedisTest - GET pass token 11
        for (int i = 0; i < 11; i++) {
            log.info("GET pass token " + (i + 1));
            rateLimiter.acquire(1);
            latch.countDown();
        }

        latch.await();
        log.info("Finish");
    }

    @Test
    public void testQueue() {
        RQueue<CustomMessage> queue = redisson.getQueue("anyQueue");
        queue.add(new CustomMessage("Hello"));
        CustomMessage obj = queue.peek();
        CustomMessage someObj = queue.poll();
    }

    @Test
    public void testQueueScene() throws InterruptedException {
        RQueue<CustomMessage> queue = redisson.getQueue("anyQueue2");
        CountDownLatch latch = new CountDownLatch(10);

        // 一个生产者进程，每1s放入一条数据
        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                CustomMessage obj = new CustomMessage("Hello" + i);
                queue.add(obj);
                log.info("Produce Obj: {}", obj);
                ThreadUtil.sleep(1000);
            }
        }).start();

        ThreadUtil.sleep(2000);

        // 一个消费者进程，每2s消费一条数据
        new Thread(() -> {
            while (!queue.isEmpty()) {
                CustomMessage obj = queue.poll();
                log.info("Consume Obj: {}", obj);
                latch.countDown();
                ThreadUtil.sleep(2000);
            }
        }).start();

        latch.await();
        log.info("Finish");

        //16:17:36.680 [Thread-0] INFO com.faber.common.redis.RedisTest - Produce Obj: CustomMessage(message=Hello0)
        //16:17:37.689 [Thread-0] INFO com.faber.common.redis.RedisTest - Produce Obj: CustomMessage(message=Hello1)
        //16:17:38.696 [Thread-0] INFO com.faber.common.redis.RedisTest - Produce Obj: CustomMessage(message=Hello2)
        //16:17:39.704 [Thread-0] INFO com.faber.common.redis.RedisTest - Produce Obj: CustomMessage(message=Hello3)
        //16:17:40.709 [Thread-0] INFO com.faber.common.redis.RedisTest - Produce Obj: CustomMessage(message=Hello4)
        //16:17:41.714 [Thread-0] INFO com.faber.common.redis.RedisTest - Produce Obj: CustomMessage(message=Hello5)
        //16:17:42.717 [Thread-0] INFO com.faber.common.redis.RedisTest - Produce Obj: CustomMessage(message=Hello6)
        //16:17:43.723 [Thread-0] INFO com.faber.common.redis.RedisTest - Produce Obj: CustomMessage(message=Hello7)
        //16:17:44.729 [Thread-0] INFO com.faber.common.redis.RedisTest - Produce Obj: CustomMessage(message=Hello8)
        //16:17:45.732 [Thread-0] INFO com.faber.common.redis.RedisTest - Produce Obj: CustomMessage(message=Hello9)
        //
        //
        //16:17:38.700 [Thread-1] INFO com.faber.common.redis.RedisTest - Consume Obj: CustomMessage(message=Hello0)
        //16:17:40.712 [Thread-1] INFO com.faber.common.redis.RedisTest - Consume Obj: CustomMessage(message=Hello1)
        //16:17:42.718 [Thread-1] INFO com.faber.common.redis.RedisTest - Consume Obj: CustomMessage(message=Hello2)
        //16:17:44.725 [Thread-1] INFO com.faber.common.redis.RedisTest - Consume Obj: CustomMessage(message=Hello3)
        //16:17:46.734 [Thread-1] INFO com.faber.common.redis.RedisTest - Consume Obj: CustomMessage(message=Hello4)
        //16:17:48.745 [Thread-1] INFO com.faber.common.redis.RedisTest - Consume Obj: CustomMessage(message=Hello5)
        //16:17:50.752 [Thread-1] INFO com.faber.common.redis.RedisTest - Consume Obj: CustomMessage(message=Hello6)
        //16:17:52.756 [Thread-1] INFO com.faber.common.redis.RedisTest - Consume Obj: CustomMessage(message=Hello7)
        //16:17:54.765 [Thread-1] INFO com.faber.common.redis.RedisTest - Consume Obj: CustomMessage(message=Hello8)
        //16:17:56.775 [Thread-1] INFO com.faber.common.redis.RedisTest - Consume Obj: CustomMessage(message=Hello9)
    }

    @Test
    public void testDelayQueue() {
        RQueue<String> distinationQueue = redisson.getQueue("anyDelayQueue");
        RDelayedQueue<String> delayedQueue = redisson.getDelayedQueue(distinationQueue);
        // 10秒钟以后将消息发送到指定队列
        delayedQueue.offer("msg1", 10, TimeUnit.SECONDS);
        // 一分钟以后将消息发送到指定队列
        delayedQueue.offer("msg2", 1, TimeUnit.MINUTES);
    }

    @Test
    public void testDelayQueueScene1() throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(5);

        RBlockingQueue<String> blockingQueue = redisson.getBlockingQueue("dest_queue1");
        RDelayedQueue<String> delayedQueue = redisson.getDelayedQueue(blockingQueue);
        new Thread(() -> {
            while (true) {
                try {
                    // 阻塞队列有数据就返回，否则wait
                    String info = blockingQueue.take();
                    log.error(info);
                    latch.countDown();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();

        for (int i = 1; i <= 5; i++) {
            // 向阻塞队列放入数据
            delayedQueue.offer("fffffffff" + i, 13, TimeUnit.SECONDS);
            ThreadUtil.sleep(5 * 1000);
        }

        latch.await();
        log.info("Finish");
    }

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

    @Test
    public void testCountDownLatch() throws InterruptedException {
        RCountDownLatch latch = redisson.getCountDownLatch("anyCountDownLatch");
        latch.trySetCount(5);

        new Thread(() -> {
            // 在其他线程或其他JVM里
            RCountDownLatch latch1 = redisson.getCountDownLatch("anyCountDownLatch");
            for (int i = 0; i < 10; i++) {
                ThreadUtil.sleep(3, TimeUnit.SECONDS);
                latch1.countDown();
                log.info("Count: " + latch1.getCount());
            }
        }).start();

        latch.await();
        log.info("Finish");
    }

    @Test
    public void getKeys() {
        RKeys keys = redisson.getKeys();

        Iterable<String> keysByPattern = keys.getKeysByPattern("fa-web:rbac:*");

        for (String s : keysByPattern) {
            log.info(s);
        }
    }

}

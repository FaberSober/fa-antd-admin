package com.faber.base.redis;

//import com.alicp.jetcache.Cache;
//import com.alicp.jetcache.CacheManager;
import com.faber.FaTestApp;
import com.faber.api.base.admin.vo.ret.SystemConfigPo;
import com.faber.core.utils.FaRedisUtils;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.redisson.api.RKeys;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


/**
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/8 11:39
 */
@Slf4j
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {FaTestApp.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class RedisTest {

//    @Autowired
//    private CacheManager cacheManager;

    @Autowired
    private RedissonClient redisson;

    @Autowired
    FaRedisUtils faRedisUtils;

    @Test
    public void testDelSystemConfig() {
//        Cache<String, SystemConfigPo> cache = cacheManager.getCache("systemConfig");
////        System.out.println(cache.get("config"));
//
//        RKeys keys = redisson.getKeys();
//
//        Iterable<String> keysByPattern = keys.getKeysByPattern("fa-web:rbac:*");
//        for (String s : keysByPattern) {
//            log.info(s);
//        }
    }

    /**
     * lock
     * https://blog.csdn.net/Utopia_Zq/article/details/124820225
     */
    @Test
    public void testGetLock() {
        //获取锁，没有获取到锁的会阻塞
        //redisson设置一个key的默认过期时间为30s
        //redisson会自动续期
        RLock lock1 = faRedisUtils.getLock("anyLock1");
        log.info("lock1 locked={}", lock1.isLocked());

        // 上锁
        /**
         * 处理业务执行时间大于锁的时间，自动续期
         * 不设置过期时间，默认锁的时间为30s，每1/3的时间就自动续期，业务处理完需要手动释放锁
         */
        lock1.lock(); // 默认锁30s
        // lock.lock(10,TimeUnit.SECONDS);  这种是10秒后锁自动过期，不会有自动续期的机制
        // boolean res = lock.tryLock(100, 10, TimeUnit.SECONDS); 尝试加锁，最多等待100秒，上锁以后10秒自动解锁
        log.info("lock1 locked={}", lock1.isLocked());

        try {
            //模拟业务执行
            Thread.sleep(3000);
            log.info("模拟业务执行了3s");
        } catch (Exception e){
            e.printStackTrace();
        } finally {
            //释放锁
            lock1.unlock();
        }

        log.info("lock1 locked={}", lock1.isLocked());
    }


    /**
     * 模拟2个线程同时获取同一把锁
     * 1. 线程1：0s启动--->执行3s--->释放锁
     * 2. 线程2：1s启动--->执行3s--->释放锁
     */
    @Test
    public void testGetLock2() {
        //获取锁，没有获取到锁的会阻塞
        //redisson设置一个key的默认过期时间为30s
        //redisson会自动续期
        RLock lock1 = faRedisUtils.getLock("anyLock1");
        log.info("lock1 locked={}", lock1.isLocked());

        // 线程1：0s启动--->执行3s--->释放锁
        new Thread(() -> {
            log.info("线程1尝试获取锁");
            lock1.lock(); // 默认锁30s
            log.info("线程1启动");

            try {
                Thread.sleep(3000); //模拟业务执行
                log.info("线程1执行完成");
            } catch (Exception e){
                e.printStackTrace();
            }finally {
                lock1.unlock();
                log.info("线程1释放锁");
            }
        }).start();

        // 等待1s，再启动线程2
        try {
            Thread.sleep(1000);
        } catch (Exception e){
            e.printStackTrace();
        }

        new Thread(() -> {
            log.info("线程2尝试获取锁");
            lock1.lock(); // 默认锁30s
            log.info("线程2启动");

            try {
                Thread.sleep(3000); //模拟业务执行
                log.info("线程2执行完成");
            } catch (Exception e){
                e.printStackTrace();
            }finally {
                lock1.unlock();
                log.info("线程2释放锁");
            }
        }).start();

        try {
            Thread.sleep(10000);
        } catch (Exception e){
            e.printStackTrace();
        }

        log.info("lock1 locked={}", lock1.isLocked());
    }

    @Test
    public void testGoo() {
        foo();
    }

    private String foo() {
        try {
            return "bar";
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        } finally {
            log.debug("run finally");
        }
        return "";
    }

}

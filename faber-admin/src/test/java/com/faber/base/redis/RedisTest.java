package com.faber.base.redis;

import com.alicp.jetcache.Cache;
import com.alicp.jetcache.CacheManager;
import com.alicp.jetcache.anno.method.CacheConfigUtil;
import com.alicp.jetcache.anno.support.CachedAnnoConfig;
import com.faber.AdminBootstrap;
import com.faber.api.admin.vo.ret.SystemConfigPo;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.redisson.api.RKeys;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/8 11:39
 */
@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class RedisTest {

    @Autowired
    private CacheManager cacheManager;

    @Autowired
    private RedissonClient redisson;

    @Test
    public void testDelSystemConfig() {
        Cache<String, SystemConfigPo> cache = cacheManager.getCache("systemConfig");
//        System.out.println(cache.get("config"));

        RKeys keys = redisson.getKeys();

        Iterable<String> keysByPattern = keys.getKeysByPattern("fa-web:rbac:*");
        for (String s : keysByPattern) {
            log.info(s);
        }
    }

}

package com.faber.api.base.demo.biz;

import com.alicp.jetcache.Cache;
import com.alicp.jetcache.CacheManager;
import com.alicp.jetcache.anno.CacheType;
import com.alicp.jetcache.template.QuickConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.Duration;

@Service
public class RedisTestBiz {

    @Autowired
    private CacheManager cacheManager;
    private Cache<String, String> strCache;

    @PostConstruct
    public void init() {
        QuickConfig qc = QuickConfig.newBuilder("strCache:")
                .expire(Duration.ofSeconds(100))
                .cacheType(CacheType.BOTH) // two level cache
                .localLimit(50)
                .syncLocal(true) // invalidate local cache in all jvm process after update
                .build();
        strCache = cacheManager.getOrCreateCache(qc);
    }

    public void addCache(String key, String value) {
        strCache.put(key, value);
    }

    public String getCache(String key) {
        return strCache.get(key);
    }

}

package com.faber.core.config.redis.aspect;

import com.faber.core.config.redis.annotation.FaCacheClear;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.redisson.api.RBucket;
import org.redisson.api.RKeys;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


/**
 * 批量删除redis缓存
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/8 15:54
 */
@Slf4j
@Aspect
@Component
public class CacheClearAspect {

    @Autowired
    RedissonClient redisson;

    @Value("${jetcache.remote.default.keyPrefix}")
    String keyPrefix;

    @Pointcut("@annotation(com.faber.core.config.redis.annotation.FaCacheClear)")
    public void aspect() {
    }

    @Around("aspect()&&@annotation(anno)")
    public Object interceptor(ProceedingJoinPoint invocation, FaCacheClear anno) throws Throwable {
        try{
            clearCache(invocation, anno);
        }
        catch (Exception ex){
            log.error(ex.getMessage(),ex);
        }
        return invocation.proceed();
    }

    private void clearCache(ProceedingJoinPoint invocation, FaCacheClear anno) {
        String pre = anno.pre();

        RKeys keys = redisson.getKeys();
        Iterable<String> keysByPattern = keys.getKeysByPattern(keyPrefix + pre + "*");
        for (String key : keysByPattern) {
            RBucket<Object> rBucket = redisson.getBucket(key);
            rBucket.delete();
        }
    }

}

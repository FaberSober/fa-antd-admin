package com.faber.core.config.redis.aspect;

import cn.hutool.core.util.ReflectUtil;
import cn.hutool.core.util.StrUtil;
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
        String key = anno.key();

        if (StrUtil.isNotEmpty(key)) {
            // 这里简单的使用反射获取方法参数值
            Object[] arguments = invocation.getArgs();
            Object objValue = ReflectUtil.getFieldValue(arguments[0], key);
            String fullKey = keyPrefix + pre + StrUtil.toString(objValue);
            RBucket<Object> rBucket = redisson.getBucket(fullKey);
            if (rBucket != null) {
                rBucket.delete();
            }
        } else {
            RKeys keys = redisson.getKeys();
            Iterable<String> keysByPattern = keys.getKeysByPattern(keyPrefix + pre + "*");
            for (String k : keysByPattern) {
                RBucket<Object> rBucket = redisson.getBucket(k);
                rBucket.delete();
            }
        }
    }

}

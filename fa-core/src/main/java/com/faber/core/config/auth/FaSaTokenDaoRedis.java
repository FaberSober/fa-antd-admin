package com.faber.core.config.auth;

import cn.dev33.satoken.dao.SaTokenDaoRedisJackson;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * sa-token存储redis无法自定义redis key前缀的问题，参考issue：
 * https://github.com/dromara/Sa-Token/issues/203
 * https://github.com/dromara/Sa-Token/issues/142
 *
 * @author xu.pengfei
 * @date 2024-04-22 10:50:00
 */
@Primary
@Component
public class FaSaTokenDaoRedis extends SaTokenDaoRedisJackson {

    @Value("${spring.data.redis.prefix}")
    private String redisPrefix;

    private String getKey(String key) {
        return redisPrefix + ":" + key;
    }

    public String get(String key) {
        return super.get(getKey(key));
    }

    public void set(String key, String value, long timeout) {
        super.set(getKey(key), value, timeout);
    }

    public void update(String key, String value) {
        super.update(getKey(key), value);
    }

    public void delete(String key) {
        super.delete(getKey(key));
    }

    public long getTimeout(String key) {
        return super.getTimeout(getKey(key));
    }

    public void updateTimeout(String key, long timeout) {
        super.updateTimeout(getKey(key), timeout);
    }

    public Object getObject(String key) {
        return super.getObject(getKey(key));
    }

    public void setObject(String key, Object object, long timeout) {
        super.setObject(getKey(key), object, timeout);
    }

    public void updateObject(String key, Object object) {
        super.updateObject(getKey(key), object);
    }

    public void deleteObject(String key) {
        super.deleteObject(getKey(key));
    }

    public long getObjectTimeout(String key) {
        return super.getObjectTimeout(getKey(key));
    }

    public void updateObjectTimeout(String key, long timeout) {
        super.updateObjectTimeout(getKey(key), timeout);
    }

    public List<String> searchData(String prefix, String keyword, int start, int size, boolean sortType) {
        return super.searchData(getKey(prefix), keyword, start, size, sortType);
    }

}

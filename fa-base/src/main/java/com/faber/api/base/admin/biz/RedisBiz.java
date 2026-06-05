package com.faber.api.base.admin.biz;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.faber.api.base.admin.vo.ret.RedisKeyDetailVo;
import com.faber.api.base.admin.vo.ret.RedisKeyItemVo;
import com.faber.api.base.admin.vo.ret.RedisKeyListVo;
import com.faber.api.base.admin.vo.ret.RedisOverviewVo;
import jakarta.annotation.Resource;
import org.redisson.api.RBucket;
import org.redisson.api.RKeys;
import org.redisson.api.RList;
import org.redisson.api.RMap;
import org.redisson.api.RScoredSortedSet;
import org.redisson.api.RSet;
import org.redisson.api.RType;
import org.redisson.api.RedissonClient;
import org.redisson.client.codec.ByteArrayCodec;
import org.redisson.client.protocol.ScoredEntry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
public class RedisBiz {

    private static final int MAX_LIST_LIMIT = 1000;
    private static final int PREVIEW_TEXT_LIMIT = 120;

    @Resource
    private RedissonClient redisson;

    @Resource
    private ObjectMapper objectMapper;

    @Value("${spring.data.redis.prefix:}")
    private String redisPrefix;

    public RedisOverviewVo overview() {
        RedisOverviewVo data = new RedisOverviewVo();
        data.setDbSize(redisson.getKeys().count());
        data.setRedisPrefix(redisPrefix);
        return data;
    }

    public RedisKeyListVo listKeys(String keyword, Integer limit) {
        int finalLimit = Math.min(Math.max(limit == null ? 300 : limit, 1), MAX_LIST_LIMIT);
        String pattern = buildPattern(keyword);

        List<RedisKeyItemVo> items = new ArrayList<>();
        boolean truncated = false;
        RKeys keys = redisson.getKeys();

        for (String key : keys.getKeysByPattern(pattern)) {
            if (items.size() >= finalLimit) {
                truncated = true;
                break;
            }
            items.add(toKeyItem(key));
        }

        items.sort(Comparator.comparing(RedisKeyItemVo::getKey));

        RedisKeyListVo data = new RedisKeyListVo();
        data.setKeyword(keyword);
        data.setPattern(pattern);
        data.setLimit(finalLimit);
        data.setTruncated(truncated);
        data.setItems(items);
        return data;
    }

    public RedisKeyDetailVo detail(String key) {
        String redisKey = requireKey(key);
        RKeys keys = redisson.getKeys();
        RType redisType = keys.getType(redisKey);
        if (redisType == null) {
            throw new IllegalArgumentException("Redis key不存在: " + redisKey);
        }

        RedisKeyDetailVo detail = new RedisKeyDetailVo();
        detail.setKey(redisKey);
        detail.setType(mapType(redisType));
        detail.setTtlSeconds(normalizeTtl(keys.remainTimeToLive(redisKey)));
        detail.setPersistent(detail.getTtlSeconds() == null);

        switch (redisType) {
            case OBJECT -> fillObjectDetail(detail, redisKey);
            case MAP -> fillMapDetail(detail, redisKey);
            case LIST -> fillListDetail(detail, redisKey);
            case SET -> fillSetDetail(detail, redisKey);
            case ZSET -> fillZsetDetail(detail, redisKey);
            default -> {
                detail.setSize(0);
                detail.setValueText("当前类型暂不支持预览");
            }
        }
        return detail;
    }

    public boolean delete(String key) {
        String redisKey = requireKey(key);
        return redisson.getKeys().delete(redisKey) > 0;
    }

    public long batchDelete(List<String> keys) {
        if (keys == null || keys.isEmpty()) {
            return 0;
        }
        List<String> validKeys = keys.stream()
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        if (validKeys.isEmpty()) {
            return 0;
        }
        return redisson.getKeys().delete(validKeys.toArray(new String[0]));
    }

    private RedisKeyItemVo toKeyItem(String key) {
        RKeys keys = redisson.getKeys();
        RType redisType = keys.getType(key);

        RedisKeyItemVo item = new RedisKeyItemVo();
        item.setKey(key);
        item.setType(mapType(redisType));
        item.setTtlSeconds(normalizeTtl(keys.remainTimeToLive(key)));
        item.setPersistent(item.getTtlSeconds() == null);
        item.setSize(getSize(key, redisType));
        item.setSummary(getSummary(key, redisType));
        return item;
    }

    private void fillObjectDetail(RedisKeyDetailVo detail, String key) {
        RBucket<Object> bucket = redisson.getBucket(key, ByteArrayCodec.INSTANCE);
        Object value = bucket.get();
        detail.setSize(getRawSize(value));
        detail.setValueText(formatRawValue(value));
    }

    private void fillMapDetail(RedisKeyDetailVo detail, String key) {
        RMap<Object, Object> map = redisson.getMap(key, ByteArrayCodec.INSTANCE);
        Map<Object, Object> data = map.readAllMap();
        detail.setSize(data.size());
        detail.setEntries(new ArrayList<>());
        for (Map.Entry<Object, Object> entry : data.entrySet()) {
            RedisKeyDetailVo.Entry item = new RedisKeyDetailVo.Entry();
            item.setField(formatRawValue(entry.getKey()));
            item.setValue(formatRawValue(entry.getValue()));
            detail.getEntries().add(item);
        }
    }

    private void fillListDetail(RedisKeyDetailVo detail, String key) {
        RList<Object> list = redisson.getList(key, ByteArrayCodec.INSTANCE);
        List<Object> data = list.readAll();
        detail.setSize(data.size());
        detail.setEntries(new ArrayList<>());
        for (int i = 0; i < data.size(); i++) {
            RedisKeyDetailVo.Entry item = new RedisKeyDetailVo.Entry();
            item.setIndex(i);
            item.setValue(formatRawValue(data.get(i)));
            detail.getEntries().add(item);
        }
    }

    private void fillSetDetail(RedisKeyDetailVo detail, String key) {
        RSet<Object> set = redisson.getSet(key, ByteArrayCodec.INSTANCE);
        Collection<Object> data = set.readAll();
        detail.setSize(data.size());
        detail.setEntries(new ArrayList<>());
        int index = 0;
        for (Object value : data) {
            RedisKeyDetailVo.Entry item = new RedisKeyDetailVo.Entry();
            item.setIndex(index++);
            item.setValue(formatRawValue(value));
            detail.getEntries().add(item);
        }
    }

    private void fillZsetDetail(RedisKeyDetailVo detail, String key) {
        RScoredSortedSet<Object> zset = redisson.getScoredSortedSet(key, ByteArrayCodec.INSTANCE);
        Collection<ScoredEntry<Object>> data = zset.entryRange(0, -1);
        detail.setSize(data.size());
        detail.setEntries(new ArrayList<>());
        int index = 0;
        for (ScoredEntry<Object> entry : data) {
            RedisKeyDetailVo.Entry item = new RedisKeyDetailVo.Entry();
            item.setIndex(index++);
            item.setScore(entry.getScore());
            item.setValue(formatRawValue(entry.getValue()));
            detail.getEntries().add(item);
        }
    }

    private Integer getSize(String key, RType redisType) {
        if (redisType == null) {
            return 0;
        }
        return switch (redisType) {
            case OBJECT -> {
                Object value = redisson.getBucket(key, ByteArrayCodec.INSTANCE).get();
                yield getRawSize(value);
            }
            case MAP -> redisson.getMap(key).size();
            case LIST -> redisson.getList(key).size();
            case SET -> redisson.getSet(key).size();
            case ZSET -> redisson.getScoredSortedSet(key).size();
            default -> 0;
        };
    }

    private String getSummary(String key, RType redisType) {
        if (redisType == null) {
            return "未知类型";
        }
        try {
            return switch (redisType) {
                case OBJECT -> abbreviate(formatRawValue(redisson.getBucket(key, ByteArrayCodec.INSTANCE).get()));
                case MAP -> {
                    Map<Object, Object> map = redisson.getMap(key, ByteArrayCodec.INSTANCE).readAllMap();
                    yield "字段 " + map.size() + " 项";
                }
                case LIST -> {
                    List<Object> list = redisson.getList(key, ByteArrayCodec.INSTANCE).range(0, 2);
                    yield "列表 " + redisson.getList(key).size() + " 项 | " + abbreviate(joinPreview(list));
                }
                case SET -> {
                    Collection<Object> set = redisson.getSet(key, ByteArrayCodec.INSTANCE).readAll();
                    yield "集合 " + set.size() + " 项 | " + abbreviate(joinPreview(set.stream().limit(3).toList()));
                }
                case ZSET -> {
                    Collection<ScoredEntry<Object>> entries = redisson.getScoredSortedSet(key, ByteArrayCodec.INSTANCE).entryRange(0, 2);
                    List<String> preview = new ArrayList<>();
                    for (ScoredEntry<Object> entry : entries) {
                        preview.add(abbreviate(formatRawValue(entry.getValue())) + "(" + entry.getScore() + ")");
                    }
                    yield "有序集合 " + redisson.getScoredSortedSet(key).size() + " 项 | " + abbreviate(String.join(", ", preview));
                }
                default -> "暂不支持预览";
            };
        } catch (Exception e) {
            return "预览失败";
        }
    }

    private String joinPreview(Collection<?> values) {
        List<String> preview = new ArrayList<>();
        for (Object value : values) {
            preview.add(stringify(value));
        }
        return String.join(", ", preview);
    }

    private String serializeValue(Object value) {
        if (value == null) {
            return "";
        }
        if (value instanceof CharSequence) {
            return value.toString();
        }
        try {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(value);
        } catch (JsonProcessingException e) {
            return String.valueOf(value);
        }
    }

    private String stringify(Object value) {
        if (value == null) {
            return "";
        }
        if (value instanceof byte[] bytes) {
            return formatRawValue(bytes);
        }
        if (value instanceof CharSequence || value instanceof Number || value instanceof Boolean) {
            return String.valueOf(value);
        }
        return serializeValue(value);
    }

    private String formatRawValue(Object rawValue) {
        if (rawValue == null) {
            return "";
        }
        if (rawValue instanceof byte[] bytes) {
            return formatBytes(bytes);
        }
        if (rawValue instanceof CharSequence || rawValue instanceof Number || rawValue instanceof Boolean) {
            return String.valueOf(rawValue);
        }
        return serializeValue(rawValue);
    }

    private int getRawSize(Object rawValue) {
        if (rawValue instanceof byte[] bytes) {
            return bytes.length;
        }
        return rawValue == null ? 0 : formatRawValue(rawValue).length();
    }

    private String formatBytes(byte[] bytes) {
        if (bytes == null || bytes.length == 0) {
            return "";
        }
        String text = new String(bytes, StandardCharsets.UTF_8);
        if (isReadableText(text, bytes)) {
            return text;
        }
        return "[base64] " + Base64.getEncoder().encodeToString(bytes);
    }

    private boolean isReadableText(String text, byte[] source) {
        if (text.indexOf('\uFFFD') >= 0) {
            return false;
        }
        int controlCount = 0;
        for (int i = 0; i < text.length(); i++) {
            char ch = text.charAt(i);
            if (Character.isISOControl(ch) && ch != '\n' && ch != '\r' && ch != '\t') {
                controlCount++;
            }
        }
        return controlCount <= Math.max(1, source.length / 16);
    }

    private String abbreviate(String value) {
        if (!StringUtils.hasText(value)) {
            return "";
        }
        String normalized = value.replaceAll("\\s+", " ").trim();
        if (normalized.length() <= PREVIEW_TEXT_LIMIT) {
            return normalized;
        }
        return normalized.substring(0, PREVIEW_TEXT_LIMIT) + "...";
    }

    private String buildPattern(String keyword) {
        if (!StringUtils.hasText(keyword)) {
            return "*";
        }
        String value = keyword.trim();
        if (value.contains("*")) {
            return value;
        }
        return "*" + value + "*";
    }

    private String requireKey(String key) {
        if (!StringUtils.hasText(key)) {
            throw new IllegalArgumentException("Redis key不能为空");
        }
        return key.trim();
    }

    private Long normalizeTtl(long ttl) {
        if (ttl < 0) {
            return null;
        }
        return ttl / 1000;
    }

    private String mapType(RType redisType) {
        if (redisType == null) {
            return "unknown";
        }
        return switch (redisType) {
            case OBJECT -> "string";
            case MAP -> "hash";
            case LIST -> "list";
            case SET -> "set";
            case ZSET -> "zset";
            default -> redisType.name().toLowerCase();
        };
    }
}

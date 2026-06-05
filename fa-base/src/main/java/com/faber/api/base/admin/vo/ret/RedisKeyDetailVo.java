package com.faber.api.base.admin.vo.ret;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class RedisKeyDetailVo implements Serializable {

    private String key;

    private String type;

    private Long ttlSeconds;

    private Boolean persistent;

    private Integer size;

    private String valueText;

    private List<Entry> entries;

    @Data
    public static class Entry implements Serializable {

        private Integer index;

        private String field;

        private String value;

        private Double score;
    }
}

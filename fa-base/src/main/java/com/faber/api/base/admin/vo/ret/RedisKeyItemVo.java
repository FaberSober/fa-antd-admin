package com.faber.api.base.admin.vo.ret;

import lombok.Data;

import java.io.Serializable;

@Data
public class RedisKeyItemVo implements Serializable {

    private String key;

    private String type;

    private Long ttlSeconds;

    private Boolean persistent;

    private Integer size;

    private String summary;
}

package com.faber.api.base.admin.vo.ret;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class RedisKeyListVo implements Serializable {

    private String keyword;

    private String pattern;

    private Integer limit;

    private Boolean truncated;

    private List<RedisKeyItemVo> items;
}

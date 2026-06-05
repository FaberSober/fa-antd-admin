package com.faber.api.base.admin.vo.ret;

import lombok.Data;

import java.io.Serializable;

@Data
public class RedisOverviewVo implements Serializable {

    private Long dbSize;

    private String redisPrefix;
}

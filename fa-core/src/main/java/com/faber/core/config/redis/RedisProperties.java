package com.faber.core.config.redis;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "spring.data.redis")
@Data
public class RedisProperties {

    private String host;
    private int port;
    private String password;
    private int timeout;
    private int database;

}

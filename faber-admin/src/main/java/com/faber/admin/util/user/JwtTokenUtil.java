package com.faber.admin.util.user;

import cn.hutool.core.util.StrUtil;
import cn.hutool.jwt.JWT;
import cn.hutool.jwt.JWTUtil;
import com.faber.admin.util.jwt.JWTInfo;
import com.faber.common.exception.auth.UserTokenException;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * JWT帮助类
 */
@Component
@Data
@Slf4j
public class JwtTokenUtil {

    @Value("${jwt.expire}")
    private int expire;

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.token-header}")
    private String tokenHeader;

    /**
     * 创建jwt token
     * @param jwtInfo
     * @return
     */
    public String createToken(JWTInfo jwtInfo) {
        byte[] key = secret.getBytes();
        return JWT.create()
                .setPayload("id", jwtInfo.getUserId())
                .setPayload("source", jwtInfo.getSource())
                .setKey(key)
                .setExpiresAt(new Date(System.currentTimeMillis() + expire * 1000L))
                .sign();
    }

    /**
     * 验证并解析token
     * @param token
     * @return
     */
    public JWTInfo parseToken(String token) {
        try {
            if (StrUtil.isEmpty(token)) throw new UserTokenException("令牌失效，请重新登录！");

            byte[] key = secret.getBytes();

            // 1. 验证token是否有效
            boolean verify = JWT.of(token).setKey(key).validate(0);
            if (!verify) throw new UserTokenException("令牌失效，请重新登录！");

            final JWT jwt = JWTUtil.parseToken(token);
            String userId = (String) jwt.getPayload("id");
            String source = (String) jwt.getPayload("source");

            return new JWTInfo(userId, source);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new UserTokenException("令牌失效，请重新登录！");
        }
    }

}

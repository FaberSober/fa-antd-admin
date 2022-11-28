package com.faber.config.utils.user;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.jwt.JWT;
import cn.hutool.jwt.JWTUtil;
import com.faber.config.utils.jwt.JWTInfo;
import com.faber.core.constant.FaSetting;
import com.faber.core.exception.auth.UserTokenException;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.Date;

/**
 * JWT帮助类
 * @author xu.pengfei
 * @date 2022/11/28 11:31
 */
@Component
@Data
@Slf4j
public class JwtTokenUtil {

    private long expire;
    private String secret;
    private String tokenHeader;

    @Resource
    private FaSetting faSetting;

    @PostConstruct
    public void init() {
        BeanUtil.copyProperties(faSetting.getJwt(), this);
    }

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
            if (StrUtil.isEmpty(token)) {
                throw new UserTokenException("令牌失效，请重新登录！");
            }

            byte[] key = secret.getBytes();

            // 1. 验证token是否有效
            boolean verify = JWT.of(token).setKey(key).validate(0);
            if (!verify) {
                throw new UserTokenException("令牌失效，请重新登录！");
            }

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

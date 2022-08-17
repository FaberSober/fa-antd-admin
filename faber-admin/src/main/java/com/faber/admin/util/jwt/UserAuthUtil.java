package com.faber.admin.util.jwt;

import com.faber.admin.config.redis.KeyConfiguration;
import com.faber.common.exception.auth.UserTokenException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.SignatureException;
import org.springframework.context.annotation.Configuration;

import javax.annotation.Resource;

/**
 * 用户鉴权
 */
@Configuration
public class UserAuthUtil {

    @Resource
    private KeyConfiguration keyConfiguration;

    /**
     * 获取token中的用户信息
     */
    public IJWTInfo getInfoFromToken(String token) throws Exception {
        try {
            return JWTHelper.getInfoFromToken(token, keyConfiguration.getUserPubKey());
        } catch (ExpiredJwtException ex) {
            throw new UserTokenException("令牌过期，请重新登录！");
        } catch (SignatureException ex) {
            throw new UserTokenException("令牌为空，请登录！");
        } catch (IllegalArgumentException ex) {
            throw new UserTokenException("令牌为空，请登录！");
        }
    }
}

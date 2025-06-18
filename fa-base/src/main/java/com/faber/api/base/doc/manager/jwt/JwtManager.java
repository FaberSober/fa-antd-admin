package com.faber.api.base.doc.manager.jwt;

import cn.hutool.json.JSONObject;
import cn.hutool.jwt.JWT;
import cn.hutool.jwt.JWTUtil;
import com.faber.core.constant.FaSetting;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * @author Farando
 * @date 2023/3/13 16:55
 * @description
 */
@Component
public class JwtManager {

    @Resource
    FaSetting faSetting;

    /**
     * 创建JWT token
     * @param payloadClaims
     * @return
     */
    public String createToken(Map<String, Object> payloadClaims) {
        JWT jwt = JWT.create();
        for (String key : payloadClaims.keySet()) {  // run through all the keys from the payload
            jwt.setPayload(key, payloadClaims.get(key));  // and write each claim to the jwt
        }

        // 密钥
        byte[] key = faSetting.getOnlyoffice().getDocserviceSecret().getBytes();
        return jwt.setKey(key).sign();
    }

    /**
     * 读取document server 调用callback接口里的 token
     */
    public JSONObject readToken() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String token = request.getHeader(faSetting.getOnlyoffice().getDocserviceHeader());

        final JWT jwt = JWTUtil.parseToken(token);
        return jwt.getPayloads();
    }

}

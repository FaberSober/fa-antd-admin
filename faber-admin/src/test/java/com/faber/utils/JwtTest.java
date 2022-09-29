package com.faber.utils;

import cn.hutool.jwt.JWT;
import cn.hutool.jwt.JWTHeader;
import cn.hutool.jwt.JWTUtil;
import cn.hutool.jwt.signers.JWTSigner;
import cn.hutool.jwt.signers.JWTSignerUtil;
import org.junit.Test;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class JwtTest {

    @Test
    public void testCreateToken() {
        Map<String, Object> map = new HashMap<String, Object>() {
            private static final long serialVersionUID = 1L;
            {
                put("uid", Integer.parseInt("123"));
                put("expire_time", System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 15);
            }
        };

        String token = JWTUtil.createToken(map, "1234".getBytes());
        System.out.println(token);

        final JWT jwt = JWTUtil.parseToken(token);

        System.out.println("JWTHeader.TYPE: " + jwt.getHeader(JWTHeader.TYPE));
        System.out.println("Payload.uid: " + jwt.getPayload("uid"));
        System.out.println("Payload.expire_time: " + jwt.getPayload("expire_time"));
    }

    @Test
    public void testParseToken() {
        String keyStr = "1234567890";
        // 密钥
        byte[] key = keyStr.getBytes();

        String token = JWT.create()
                .setPayload("id", "1234567890")
                .setPayload("source", "web")
                .setKey(key)
                .setExpiresAt(new Date(System.currentTimeMillis() + 3000))
                .sign();

        final JWT jwt = JWTUtil.parseToken(token).setKey(key);

        System.out.println("JWTHeader.TYPE: " + jwt.getHeader(JWTHeader.TYPE));
        System.out.println("Payload.id: " + jwt.getPayload("id"));
        System.out.println("Payload.source: " + jwt.getPayload("source"));
    }

    @Test
    public void testVerify() {
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
                "eyJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbImFsbCJdLCJleHAiOjE2MjQwMDQ4MjIsInVzZXJJZCI6MSwiYXV0aG9yaXRpZXMiOlsiUk9MRV_op5LoibLkuozlj7ciLCJzeXNfbWVudV8xIiwiUk9MRV_op5LoibLkuIDlj7ciLCJzeXNfbWVudV8yIl0sImp0aSI6ImQ0YzVlYjgwLTA5ZTctNGU0ZC1hZTg3LTVkNGI5M2FhNmFiNiIsImNsaWVudF9pZCI6ImhhbmR5LXNob3AifQ." +
                "aixF1eKlAKS_k3ynFnStE7-IRGiD5YaqznvK2xEjBew";

        boolean verify = JWTUtil.verify(token, "123456".getBytes());
        System.out.println("verify: " + verify);
    }

    @Test
    public void testVerifyExpire() throws InterruptedException {
        String keyStr = "1234567890";
        // 密钥
        byte[] key = keyStr.getBytes();

        String token = JWT.create()
                .setPayload("id", "1234567890")
                .setPayload("source", "web")
                .setKey(key)
                .setExpiresAt(new Date(System.currentTimeMillis() + 3000))
                .sign();

        System.out.println("token: " + token);

        boolean verify = JWTUtil.verify(token, key);
        System.out.println("verify: " + JWTUtil.verify(token, key));

        Thread.sleep(1000);
        System.out.println("verify: " + JWT.of(token).setKey(key).validate(0));

        Thread.sleep(1000);
        System.out.println("verify: " + JWT.of(token).setKey(key).validate(0));

        Thread.sleep(1000);
        System.out.println("verify: " + JWT.of(token).setKey(key).validate(0));

        Thread.sleep(1000);
        System.out.println("verify: " + JWT.of(token).setKey(key).validate(0));
    }

    @Test
    public void testSigner() {
        String keyStr = "1234567890";
        // 密钥
        byte[] key = keyStr.getBytes();

        final JWTSigner signer = JWTSignerUtil.hs256(key);

        String token = JWT.create()
                .setPayload("id", "1234567890")
                .setPayload("source", "web")
                .setKey(key)
                .setExpiresAt(new Date(System.currentTimeMillis() + 3000))
                .setSigner(signer)
                .sign();
        System.out.println("token: " + token);

        final JWT jwt = JWTUtil.parseToken(token);

        System.out.println("JWTHeader.TYPE: " + jwt.getHeader(JWTHeader.TYPE));
        System.out.println("Payload.id: " + jwt.getPayload("id"));
        System.out.println("Payload.source: " + jwt.getPayload("source"));

        System.out.println("verify: " + JWTUtil.verify(token, key));
        System.out.println("verify: " + JWTUtil.verify(token, "123456789".getBytes()));

        System.out.println("verify: " + JWTUtil.verify(token, JWTSignerUtil.hs256(key)));
        System.out.println("verify: " + JWTUtil.verify(token, JWTSignerUtil.hs256("123456789".getBytes())));
    }

}

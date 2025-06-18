package com.faber.core.util;

import cn.hutool.json.JSON;
import cn.hutool.json.JSONObject;
import cn.hutool.jwt.JWT;
import org.junit.jupiter.api.Test;

/**
 * @author Farando
 * @date 2023/3/13 15:25
 * @description
 */
public class JwtTest {

    @Test
    public void testGen() {
        // 密钥
        byte[] key = "faberJWT1256".getBytes();

        String onlyofficeConfig = "{\n" +
                "    \"document\": {\n" +
                "        \"fileType\": \"docx\",\n" +
                "        \"key\": \"testdocx00001\",\n" +
                "        \"title\": \"Example Document Title.docx\",\n" +
                "        \"url\": \"http://file.qiniu.test.dward.cn/tmp/doc/test.docx\"\n" +
                "    },\n" +
                "    \"documentType\": \"word\",\n" +
                "    \"editorConfig\": {\n" +
                "        \"callbackUrl\": \"https://example.com/url-to-callback.ashx\",\n" +
                "        \"lang\": \"zh\",\n" +
                "        \"user\": {\n" +
                "            \"id\": \"1\",\n" +
                "            \"name\": \"王美丽\",\n" +
                "            \"group\": \"\"\n" +
                "        }\n" +
                "    }\n" +
                "}";
        JSONObject json = new JSONObject(onlyofficeConfig);

        String token = JWT.create()
                .setPayload("document", json.getJSONObject("document"))
                .setPayload("documentType", json.getStr("documentType"))
                .setPayload("editorConfig", json.getJSONObject("editorConfig"))
                .setKey(key)
                .sign();
        System.out.println("token--->>>");
        System.out.println(token);
    }

}

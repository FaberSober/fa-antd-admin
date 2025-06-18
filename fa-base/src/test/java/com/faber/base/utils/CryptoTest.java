package com.faber.base.utils;

import cn.hutool.core.util.CharsetUtil;
import cn.hutool.crypto.SecureUtil;
import cn.hutool.crypto.symmetric.AES;
import cn.hutool.crypto.symmetric.SymmetricAlgorithm;
import cn.hutool.crypto.symmetric.SymmetricCrypto;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;

public class CryptoTest {

    @Test
    public void testAESEncrypt() {
        String content = "test中文";

        //随机生成密钥
        byte[] key = SecureUtil.generateKey(SymmetricAlgorithm.AES.getValue()).getEncoded();
        System.out.println("key:\t" + key);
        System.out.println("keyStr:\t" + new String(key, StandardCharsets.UTF_8));

        //构建
        SymmetricCrypto aes = new SymmetricCrypto(SymmetricAlgorithm.AES, key);

        //加密
        byte[] encrypt = aes.encrypt(content);
        //解密
        byte[] decrypt = aes.decrypt(encrypt);

        //加密为16进制表示
        String encryptHex = aes.encryptHex(content);
        System.out.println("encryptHex: \t" + encryptHex);

        //解密为字符串
        String decryptStr = aes.decryptStr(encryptHex, CharsetUtil.CHARSET_UTF_8);
        System.out.println("decryptStr: \t" + decryptStr);
    }

    @Test
    public void testAES() {
        String content = "test中文";

        AES aes = new AES("CBC", "PKCS7Padding",
                // 密钥，可以自定义
                "2345ASDC89ABCSEQ".getBytes(),
                // iv加盐，按照实际需求添加
                "DYgaREIsYrj24QxN".getBytes());

        // 加密为16进制表示
        String encryptHex = aes.encryptHex(content);
        System.out.println("encryptHex: \t" + encryptHex);

        // 解密
        String decryptStr = aes.decryptStr(encryptHex);
        System.out.println("decryptStr: \t" + decryptStr);
    }

}

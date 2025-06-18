package com.faber.base.utils;

import cn.hutool.core.util.CharsetUtil;
import cn.hutool.crypto.symmetric.SymmetricAlgorithm;
import cn.hutool.crypto.symmetric.SymmetricCrypto;
import org.junit.jupiter.api.Test;

public class CryptTest {

    @Test
    public void testEncrypt() {
        String content = "123456";
        String keyStr = "faber@cesi#12345";
        //随机生成密钥
//        byte[] key = SecureUtil.generateKey(SymmetricAlgorithm.AES.getValue()).getEncoded();
        byte[] key = keyStr.getBytes();
        System.out.println("key:\t" + new String(key, CharsetUtil.CHARSET_UTF_8));

        //构建
        SymmetricCrypto aes = new SymmetricCrypto(SymmetricAlgorithm.AES, key);

        //加密
        byte[] encrypt = aes.encrypt(content);
        //解密
        byte[] decrypt = aes.decrypt(encrypt);

        //加密为16进制表示
        String encryptHex = aes.encryptHex(content);
        System.out.println("encryptHex:\t" + encryptHex);
        //解密为字符串
        String decryptStr = aes.decryptStr(encryptHex, CharsetUtil.CHARSET_UTF_8);
        System.out.println("decryptStr:\t" + decryptStr);
    }

}

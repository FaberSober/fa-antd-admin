package com.faber.core.utils;

import com.faber.core.constant.CommonConstants;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * @author Farando
 * @date 2023/3/3 16:45
 * @description
 */
public class FaPwdUtils {

    private static BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(CommonConstants.PW_ENCODER_SALT);

    /**
     * 验证明文密码与加密密码是否相同
     *
     * @param rawPassword
     * @param encodedPassword
     * @return
     */
    public static boolean checkPwd(CharSequence rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }

    /**
     * 加密密码
     *
     * @param pwd
     * @return
     */
    public static String encryptPwd(String pwd) {
        return encoder.encode(pwd);
    }

}

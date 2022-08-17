package com.faber.common.util;

import cn.hutool.core.util.RandomUtil;

/**
 * 短信帮助类
 */
public class SmsUtils {

    /**
     * 生成短信验证码
     * @return
     */
    public static String genCode() {
        return RandomUtil.randomNumbers(6);
    }

}

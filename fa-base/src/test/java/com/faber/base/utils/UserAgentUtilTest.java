package com.faber.base.utils;

import cn.hutool.http.useragent.UserAgent;
import cn.hutool.http.useragent.UserAgentUtil;
import org.junit.jupiter.api.Test;

public class UserAgentUtilTest {

    @Test
    public void test1() {
        String agent = "Mozilla/5.0 (Linux; Android 10; EVR-AL00 Build/HUAWEIEVR-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.186 Mobile Safari/537.36 baiduboxapp/11.0.5.12 (Baidu; P1 10)";
        UserAgent ua = UserAgentUtil.parse(agent);
        System.out.println(ua.getVersion());
        System.out.println(ua.isMobile());
    }

}

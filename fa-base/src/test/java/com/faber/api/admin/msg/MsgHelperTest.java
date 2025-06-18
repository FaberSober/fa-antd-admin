package com.faber.api.admin.msg;

import com.faber.FaTestApp;
import com.faber.api.base.msg.helper.MsgHelper;
import com.faber.api.base.msg.helper.config.MsgSendConfig;
import com.faber.api.base.msg.helper.config.MsgSendSmsCode;
import com.faber.api.base.msg.helper.config.MsgSendSysConfig;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.boot.test.context.SpringBootTest;


import jakarta.annotation.Resource;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {FaTestApp.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class MsgHelperTest {

    @Resource
    private MsgHelper msgHelper;

    /**
     * 测试系统消息
     */
    @Test
    public void testSendSys() {
        MsgSendConfig msgSendConfig = MsgSendSysConfig.builder()
                .content("测试系统消息")
                .buzzId("123")
                .build();
        msgHelper.sendSysMsg("1", new String[]{"1"}, msgSendConfig);
    }

    @Test
    public void testSendSmsCode() {
        MsgSendConfig msgSendConfig = MsgSendSmsCode.builder()
                .buzzId("13042563001") // 手机号
                .code("123456")
                .build();
        msgHelper.sendSysMsg("1", new String[]{"1"}, msgSendConfig);
    }

}

package com.faber.admin.msg;

import com.faber.AdminBootstrap;
import com.faber.api.msg.helper.MsgHelper;
import com.faber.api.msg.helper.config.MsgSendConfig;
import com.faber.api.msg.helper.config.MsgSendSmsCode;
import com.faber.api.msg.helper.config.MsgSendSysConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
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

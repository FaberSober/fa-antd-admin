package com.faber.base;

import com.faber.AdminBootstrap;
import com.faber.common.constant.SystemSetting;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SystemSettingTest {

    @Resource
    private SystemSetting systemSetting;

    @Test
    public void testGetSetting() {
        System.out.println(systemSetting);
    }

}

package com.faber.base;

import com.faber.AdminBootstrap;
import com.faber.common.constant.FaSetting;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class FaSettingTest {

    @Resource
    private FaSetting faSetting;

    @Test
    public void testGetSetting() {
        System.out.println(faSetting);
    }

}

package com.faber.base;

import com.faber.FaTestApp;
import com.faber.core.constant.FaSetting;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.boot.test.context.SpringBootTest;


import jakarta.annotation.Resource;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {FaTestApp.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class FaSettingTest {

    @Resource
    private FaSetting faSetting;

    @Test
    public void testGetSetting() {
        System.out.println(faSetting);
    }

}

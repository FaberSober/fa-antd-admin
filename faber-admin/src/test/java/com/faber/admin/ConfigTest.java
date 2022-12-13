package com.faber.admin;

import com.faber.AdminBootstrap;
import com.faber.api.base.admin.biz.ConfigBiz;
import com.faber.api.base.admin.entity.Config;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;

@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ConfigTest {

    @Resource
    ConfigBiz configBiz;

    @Test
    public void testGetById() {
        Config config = configBiz.getById(1);
        log.info(config.toString());
    }

}

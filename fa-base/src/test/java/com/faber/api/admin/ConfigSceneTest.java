package com.faber.api.admin;

import com.faber.FaTestApp;
import com.faber.api.base.admin.biz.ConfigSceneBiz;
import com.faber.api.base.admin.entity.ConfigScene;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.boot.test.context.SpringBootTest;


import jakarta.annotation.Resource;

@Slf4j
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {FaTestApp.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ConfigSceneTest {

    @Resource
    ConfigSceneBiz configSceneBiz;

    @Test
    public void testGetById() {
        ConfigScene configScene = configSceneBiz.getById(1);
        log.info(configScene.toString());
    }

    @Test
    public void updateById() {
        ConfigScene configScene = configSceneBiz.getById(1);
        configSceneBiz.updateById(configScene);
    }

}

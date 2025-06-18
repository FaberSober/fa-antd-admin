package com.faber.api.admin;

import com.faber.FaTestApp;
import com.faber.api.base.admin.biz.ConfigSysBiz;
import com.faber.api.base.admin.entity.ConfigSys;
import com.faber.api.base.admin.vo.ret.SystemConfigPo;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.boot.test.context.SpringBootTest;


import jakarta.annotation.Resource;

@Slf4j
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {FaTestApp.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ConfigSysTest {

    @Resource
    ConfigSysBiz configSysBiz;

    @Test
    public void testGetById() {
        ConfigSys configSys = configSysBiz.getOne();
        log.info(configSys.toString());
    }

    @Test
    public void testGetSystemConfig() {
        SystemConfigPo systemConfigPo = configSysBiz.getSystemConfig();
        System.out.println(systemConfigPo);
    }

}

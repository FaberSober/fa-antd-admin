package com.faber.admin;

import com.faber.AdminBootstrap;
import com.faber.api.base.admin.biz.ConfigSysBiz;
import com.faber.api.base.admin.entity.ConfigSys;
import com.faber.api.base.admin.vo.ret.SystemConfigPo;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;

@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
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

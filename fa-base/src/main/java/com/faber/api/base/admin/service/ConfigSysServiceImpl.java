package com.faber.api.base.admin.service;

import cn.hutool.core.util.StrUtil;
import com.faber.api.base.admin.biz.ConfigSysBiz;
import com.faber.api.base.admin.entity.ConfigSys;
import com.faber.core.service.ConfigSysService;
import com.faber.core.vo.config.FaConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.io.IOException;

@Slf4j
@Service
public class ConfigSysServiceImpl implements ConfigSysService {

    @Resource
    ConfigSysBiz configSysBiz;

    @Override
    public String getStoreLocalPath() {
        try {
            ConfigSys configSys = configSysBiz.getOne();
            if (configSys == null || configSys.getData() == null || StrUtil.isEmpty(configSys.getData().getStoreLocalPath())) {
                return ConfigSysService.super.getStoreLocalPath();
            }
            return configSys.getData().getStoreLocalPath();
        } catch (Exception e) {
            log.error(e.getMessage(),e);
        }
        return null;
    }

    @Override
    public FaConfig getConfig() {
        return configSysBiz.getOne().getData();
    }

}

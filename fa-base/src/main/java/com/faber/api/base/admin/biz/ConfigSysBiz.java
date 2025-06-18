package com.faber.api.base.admin.biz;

import cn.hutool.core.bean.BeanUtil;
import com.faber.api.base.admin.entity.ConfigSys;
import com.faber.api.base.admin.mapper.ConfigSysMapper;
import com.faber.api.base.admin.vo.ret.SystemConfigPo;
import com.faber.core.constant.FaSetting;
import com.faber.core.service.StorageService;
import com.faber.core.vo.config.FaConfig;
import com.faber.core.web.biz.BaseBiz;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;

/**
 * BASE-配置-系统配置
 * @author xu.pengfei
 * @email faberxu@gmail.com
 * @date 2022/12/12 10:11
 */
@Service
public class ConfigSysBiz extends BaseBiz<ConfigSysMapper, ConfigSys> {

    @Resource
    private FaSetting faSetting;

    @Lazy
    @Autowired
    private StorageService storageService;

    ConfigSys configSysCache;

    @Override
    public boolean updateById(ConfigSys entity) {
        super.updateById(entity);

        storageService.syncStorageDatabaseConfig();
        this.refreshConfigSysCache();

        return true;
    }

    public ConfigSys getOne() {
        ConfigSys configSys = lambdaQuery().orderByDesc(ConfigSys::getId).last("limit 1").one();
        if (configSys == null) {
            configSys = new ConfigSys();

            FaConfig config = new FaConfig();
            configSys.setData(config);

            save(configSys);
        }
        return configSys;
    }

    public FaConfig getConfig() {
        if (configSysCache == null) {
            configSysCache = this.getOne();
        }
        return configSysCache.getData();
    }

    public void refreshConfigSysCache() {
        configSysCache = this.getOne();
    }

    /**
     * 获取系统参数配置
     * @return
     */
    public SystemConfigPo getSystemConfig() {
        ConfigSys configSys = getOne();

        SystemConfigPo po = new SystemConfigPo();
        // 系统服务配置
        BeanUtil.copyProperties(configSys.getData(), po);

        // 配置文件中的配置
        po.setPhpRedisAdmin(faSetting.getUrl().getPhpRedisAdmin());
        po.setSocketUrl(faSetting.getUrl().getSocketUrl());
        po.setKkFileViewUrl(faSetting.getUrl().getKkFileView());
        po.setOffline(faSetting.getConfig().getOffline());

        return po;
    }
}
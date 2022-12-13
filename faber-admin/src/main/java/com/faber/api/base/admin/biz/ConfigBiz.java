package com.faber.api.base.admin.biz;

import com.faber.api.base.admin.entity.Config;
import com.faber.api.base.admin.mapper.ConfigMapper;
import com.faber.core.bean.BaseCrtEntity;
import com.faber.core.web.biz.BaseBiz;
import org.springframework.stereotype.Service;


@Service
public class ConfigBiz extends BaseBiz<ConfigMapper, Config> {

    public Config getOne(String biz, String type) {
        return lambdaQuery()
                .eq(Config::getBiz, biz)
                .eq(Config::getType, type)
                .eq(BaseCrtEntity::getCrtUser, getCurrentUserId())
                .orderByDesc(Config::getId)
                .last("limit 1")
                .one();
    }

}
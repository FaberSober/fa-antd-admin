package com.faber.api.base.admin.biz;

import com.faber.api.base.admin.entity.Config;
import com.faber.api.base.admin.mapper.ConfigMapper;
import com.faber.core.bean.BaseCrtEntity;
import com.faber.core.web.biz.BaseBiz;
import org.springframework.stereotype.Service;


@Service
public class ConfigBiz extends BaseBiz<ConfigMapper, Config> {

    /** 全局默认追加_GLOBAL后缀 */
    public static final String GLOBAL_SUFFIX = "_GLOBAL";

    public Config getOne(String biz, String type) {
        return lambdaQuery()
                .eq(Config::getBiz, biz)
                .eq(Config::getType, type)
                .eq(BaseCrtEntity::getCrtUser, getCurrentUserId())
                .orderByDesc(Config::getId)
                .last("limit 1")
                .one();
    }

    public Config getOneGlobal(String biz, String type) {
        return lambdaQuery()
                .eq(Config::getBiz, biz + GLOBAL_SUFFIX) // 全局默认追加_GLOBAL后缀
                .eq(Config::getType, type)
                .orderByDesc(Config::getId)
                .last("limit 1")
                .one();
    }

    public void saveGlobal(Config entity) {
        Config entityDB = this.getOneGlobal(entity.getBiz(), entity.getType());
        if (entityDB == null) {
            entity.setBiz(entity.getBiz() + GLOBAL_SUFFIX);
            this.save(entity);
        } else {
            entityDB.setData(entity.getData());
            this.updateById(entityDB);
        }
    }

}
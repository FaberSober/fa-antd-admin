package com.faber.admin.biz;

import com.faber.admin.entity.Config;
import com.faber.admin.mapper.ConfigMapper;
import com.faber.common.bean.BaseDelEntity;
import com.faber.common.bean.BaseUpdEntity;
import com.faber.common.biz.BaseBiz;
import com.faber.common.enums.BoolEnum;
import com.faber.common.enums.DelStateEnum;
import org.apache.commons.collections4.MapUtils;
import org.springframework.stereotype.Service;
import tk.mybatis.mapper.entity.Example;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * 系统-配置表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-02 21:21:45
 */
@Service
public class ConfigBiz extends BaseBiz<ConfigMapper, Config> {

    @Override
    public boolean save(Config entity) {
        // 非系统配置，默认为上传用户所拥有
        if (entity.getSystem() == BoolEnum.NO && entity.getBelongUserId() == null) {
            entity.setBelongUserId(getCurrentUserId());

            // 设置sort
            int sort = baseMapper.findMaxSort(entity.getBuzzModal(), entity.getType(), getCurrentUserId());
            entity.setSort(sort);

            // 是否默认
            if (entity.getDefaultScene() == BoolEnum.YES) {
                baseMapper.clearOtherDefaultScene(entity.getBuzzModal(), entity.getType(), getCurrentUserId());
            }
        }
        return super.save(entity);
    }

    @Override
    public boolean updateById(Config entity) {
        // 非系统配置，默认为上传用户所拥有
        if (entity.getSystem() == BoolEnum.NO && entity.getBelongUserId() == null) {
            entity.setBelongUserId(getCurrentUserId());

            // 是否默认
            if (entity.getDefaultScene() == BoolEnum.YES) {
                baseMapper.clearOtherDefaultScene(entity.getBuzzModal(), entity.getType(), getCurrentUserId());
            }
        }
        return super.updateById(entity);
    }

    public List<Config> findAllScene(Map<String, Object> params) {
        String buzzModal = MapUtils.getString(params, "buzzModal");
        String type = MapUtils.getString(params, "type");

        // 查找系统配置
        List<Config> config2List = lambdaQuery().eq(Config::getBuzzModal, buzzModal)
                .eq(Config::getType, type)
                .eq(Config::getSystem, BoolEnum.YES)
                .orderByAsc(Config::getSort)
                .list();

        // 查找个人配置
        List<Config> configList = lambdaQuery().eq(Config::getBuzzModal, buzzModal)
                .eq(Config::getType, type)
                .eq(Config::getSystem, BoolEnum.NO)
                .eq(Config::getBelongUserId, getCurrentUserId())
                .orderByAsc(Config::getSort)
                .list();

        List<Config> allList = new ArrayList<>();
        allList.addAll(config2List);
        allList.addAll(configList);
        return allList;
    }

    public Config findByScene(Map<String, Object> params) {
        String buzzModal = MapUtils.getString(params, "buzzModal");
        String type = MapUtils.getString(params, "type");

        // 优先查找个人配置
        List<Config> configList = lambdaQuery().eq(Config::getBuzzModal, buzzModal)
                .eq(Config::getType, type)
                .eq(Config::getSystem, BoolEnum.NO)
                .eq(Config::getBelongUserId, getCurrentUserId())
                .orderByAsc(Config::getSort)
                .list();
        if (configList != null && configList.size() > 0) {
            return configList.get(0);
        }

        // 其次查找系统配置
        List<Config> config2List = lambdaQuery().eq(Config::getBuzzModal, buzzModal)
                .eq(Config::getType, type)
                .eq(Config::getSystem, BoolEnum.YES)
                .orderByAsc(Config::getSort)
                .list();
        if (config2List != null && config2List.size() > 0) {
            return config2List.get(0);
        }

        return null;
    }

    public void batchUpdate(List<Config> configList) {
        for (int i = 0; i < configList.size(); i++) {
            Config newConfig = configList.get(i);

            Config configDB = getById(newConfig.getId());

            if (configDB.getSystem() == BoolEnum.NO) {
                configDB.setSort(i); // 更新排序
                configDB.setHide(newConfig.getHide()); // 更新是否隐藏
                configDB.setDefaultScene(newConfig.getDefaultScene());  // 是否默认
            }
            updateById(configDB);
        }
    }
}
package com.faber.api.base.admin.biz;

import com.faber.api.base.admin.entity.ConfigScene;
import com.faber.api.base.admin.mapper.ConfigSceneMapper;
import com.faber.core.vo.query.ConditionGroup;
import com.faber.core.web.biz.BaseBiz;
import com.faber.core.service.ConfigSceneService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 系统-配置表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-02 21:21:45
 */
@Service
public class ConfigSceneBiz extends BaseBiz<ConfigSceneMapper, ConfigScene> implements ConfigSceneService {

    @Override
    public boolean save(ConfigScene entity) {
        // 设置sort
        int sort = baseMapper.findMaxSort(entity.getBiz(), getCurrentUserId());
        entity.setSort(sort);

        // 是否默认
        if (entity.getDefaultScene()) {
            baseMapper.clearOtherDefaultScene(entity.getBiz(), getCurrentUserId());
        }
        return super.save(entity);
    }

    @Override
    public boolean updateById(ConfigScene entity) {
        // 非系统配置，默认为上传用户所拥有
        if (!entity.getSystem()) {
            // 是否默认
            if (entity.getDefaultScene()) {
                baseMapper.clearOtherDefaultScene(entity.getBiz(), getCurrentUserId());
            }
        }
        return super.updateById(entity);
    }

    public List<ConfigScene> findAllScene(String biz) {
        // 查找系统配置
        List<ConfigScene> configScene2List = lambdaQuery().eq(ConfigScene::getBiz, biz)
                .eq(ConfigScene::getSystem, true)
                .orderByAsc(ConfigScene::getSort)
                .list();

        // 查找个人配置
        List<ConfigScene> configSceneList = lambdaQuery().eq(ConfigScene::getBiz, biz)
                .eq(ConfigScene::getSystem, false)
                .eq(ConfigScene::getCrtUser, getCurrentUserId())
                .orderByAsc(ConfigScene::getSort)
                .list();

        List<ConfigScene> allList = new ArrayList<>();
        allList.addAll(configScene2List);
        allList.addAll(configSceneList);
        return allList;
    }

    public ConfigScene findByScene(String biz) {
        // 优先查找个人配置
        List<ConfigScene> configSceneList = lambdaQuery().eq(ConfigScene::getBiz, biz)
                .eq(ConfigScene::getSystem, false)
                .eq(ConfigScene::getCrtUser, getCurrentUserId())
                .orderByAsc(ConfigScene::getSort)
                .list();
        if (configSceneList != null && configSceneList.size() > 0) {
            return configSceneList.get(0);
        }

        // 其次查找系统配置
        List<ConfigScene> configScene2List = lambdaQuery().eq(ConfigScene::getBiz, biz)
                .eq(ConfigScene::getSystem, true)
                .orderByAsc(ConfigScene::getSort)
                .list();
        if (configScene2List != null && configScene2List.size() > 0) {
            return configScene2List.get(0);
        }

        return null;
    }

    public void batchUpdate(List<ConfigScene> configSceneList) {
        for (int i = 0; i < configSceneList.size(); i++) {
            ConfigScene newConfigScene = configSceneList.get(i);

            ConfigScene configSceneDB = getById(newConfigScene.getId());

            if (!configSceneDB.getSystem()) {
                configSceneDB.setSort(i); // 更新排序
                configSceneDB.setHide(newConfigScene.getHide()); // 更新是否隐藏
                configSceneDB.setDefaultScene(newConfigScene.getDefaultScene());  // 是否默认
            }
            updateById(configSceneDB);
        }
    }

    @Override
    public ConditionGroup[] getConfigDataById(Integer configId) {
        ConfigScene configScene = super.getById(configId);
        if (configScene == null) {
            return null;
        }
        return configScene.getData();
    }
}
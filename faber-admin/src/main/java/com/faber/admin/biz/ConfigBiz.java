package com.faber.admin.biz;

import com.faber.admin.entity.Config;
import com.faber.admin.mapper.ConfigMapper;
import com.faber.common.bean.BaseDelEntity;
import com.faber.common.bean.BaseUpdEntity;
import com.faber.common.biz.BaseBiz;
import org.apache.commons.collections4.MapUtils;
import org.springframework.stereotype.Service;
import tk.mybatis.mapper.entity.Example;

import java.util.ArrayList;
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
    public void insertSelective(Config entity) {
        // 非系统配置，默认为上传用户所拥有
        if (BaseUpdEntity.Bool.FALSE.equalsIgnoreCase(entity.getSystem()) && entity.getBelongUserId() == null) {
            entity.setBelongUserId(getCurrentUserId());

            // 设置sort
            int sort = mapper.findMaxSort(entity.getBuzzModal(), entity.getType(), getCurrentUserId());
            entity.setSort(sort);

            // 是否默认
            if (BaseUpdEntity.Bool.TRUE.equals(entity.getDefaultScene())) {
                mapper.clearOtherDefaultScene(entity.getBuzzModal(), entity.getType(), getCurrentUserId());
            }
        }
        super.insertSelective(entity);
    }

    @Override
    public void updateSelectiveById(Config entity) {
        // 非系统配置，默认为上传用户所拥有
        if (BaseUpdEntity.Bool.FALSE.equalsIgnoreCase(entity.getSystem()) && entity.getBelongUserId() == null) {
            entity.setBelongUserId(getCurrentUserId());

            // 是否默认
            if (BaseUpdEntity.Bool.TRUE.equals(entity.getDefaultScene())) {
                mapper.clearOtherDefaultScene(entity.getBuzzModal(), entity.getType(), getCurrentUserId());
            }
        }
        super.updateSelectiveById(entity);
    }

    public List<Config> findAllScene(Map<String, Object> params) {
        String buzzModal = MapUtils.getString(params, "buzzModal");
        String type = MapUtils.getString(params, "type");

        // 查找系统配置
        Example example2 = new Example(Config.class);
        example2.createCriteria()
                .andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE)
                .andEqualTo("buzzModal", buzzModal)
                .andEqualTo("type", type)
                .andEqualTo("system", BaseUpdEntity.Bool.TRUE);
        example2.setOrderByClause("sort ASC");
        List<Config> config2List = mapper.selectByExample(example2);

        // 查找个人配置
        Example example = new Example(Config.class);
        example.createCriteria()
                .andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE)
                .andEqualTo("buzzModal", buzzModal)
                .andEqualTo("type", type)
                .andEqualTo("system", BaseUpdEntity.Bool.FALSE)
                .andEqualTo("belongUserId", getCurrentUserId());
        example.setOrderByClause("sort ASC");
        List<Config> configList = mapper.selectByExample(example);

        List<Config> allList = new ArrayList<>();

        allList.addAll(config2List);
        allList.addAll(configList);

        return allList;
    }

    public Config findByScene(Map<String, Object> params) {
        String buzzModal = MapUtils.getString(params, "buzzModal");
        String type = MapUtils.getString(params, "type");

        // 优先查找个人配置
        Example example = new Example(Config.class);
        example.createCriteria()
                .andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE)
                .andEqualTo("buzzModal", buzzModal)
                .andEqualTo("type", type)
                .andEqualTo("system", BaseUpdEntity.Bool.FALSE)
                .andEqualTo("belongUserId", getCurrentUserId());
        example.setOrderByClause("sort ASC");
        List<Config> configList = mapper.selectByExample(example);
        if (configList != null && configList.size() > 0) {
            return configList.get(0);
        }

        // 其次查找系统配置
        Example example2 = new Example(Config.class);
        example2.createCriteria()
                .andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE)
                .andEqualTo("buzzModal", buzzModal)
                .andEqualTo("type", type)
                .andEqualTo("system", BaseUpdEntity.Bool.TRUE);
        example2.setOrderByClause("sort ASC");
        List<Config> config2List = mapper.selectByExample(example2);
        if (config2List != null && config2List.size() > 0) {
            return config2List.get(0);
        }

        return null;
    }

    public void batchUpdate(List<Config> configList) {
        for (int i = 0; i < configList.size(); i++) {
            Config newConfig = configList.get(i);

            Config configDB = mapper.selectByPrimaryKey(newConfig.getId());

            if (BaseUpdEntity.Bool.FALSE.equals(configDB.getSystem())) {
                configDB.setSort(i); // 更新排序
                configDB.setHide(newConfig.getHide()); // 更新是否隐藏
                configDB.setDefaultScene(newConfig.getDefaultScene());  // 是否默认
            }
            super.updateSelectiveById(configDB);
        }
    }
}
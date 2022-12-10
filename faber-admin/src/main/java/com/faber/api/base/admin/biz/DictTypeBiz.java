package com.faber.api.base.admin.biz;

import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.ClassUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.faber.api.base.admin.entity.DictType;
import com.faber.api.base.admin.mapper.DictTypeMapper;
import com.faber.api.base.admin.vo.ret.SystemConfigPo;
import com.faber.core.constant.FaSetting;
import com.faber.core.exception.BuzzException;
import com.faber.core.exception.NoDataException;
import com.faber.core.utils.FaEnumUtils;
import com.faber.core.vo.DictOption;
import com.faber.core.web.biz.BaseTreeBiz;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 字典分类
 */
@Service
public class DictTypeBiz extends BaseTreeBiz<DictTypeMapper, DictType> {

    @Resource
    private FaSetting faSetting;

    private static final Map<String, Object> enumClassCache = new HashMap<>();

    @Override
    public boolean save(DictType entity) {
        // 插入时校验编码是否重复
        long count = lambdaQuery().eq(DictType::getCode, entity.getCode()).count();
        if (count > 0) throw new BuzzException("字典分组编码重复");

        return super.save(entity);
    }

    @Override
    public boolean updateById(DictType entity) {
        if (entity.getParentId() == entity.getId().intValue()) {
            throw new BuzzException("父节点不能是自身");
        }

        // 插入时校验编码是否重复
        long count = lambdaQuery()
                .eq(DictType::getCode, entity.getCode())
                .ne(DictType::getId, entity.getId())
                .count();
        if (count > 0) throw new BuzzException("字典分组编码重复");

        return super.updateById(entity);
    }

    @Override
    public boolean removeById(Serializable id) {
        List<DictType> list = super.getAllChildrenFromNode(id);
        for (DictType o : list) {
            // 1. 逻辑删除字典类型
            super.removeById(o.getId());
        }
        return true;
    }

    public DictType getByCode(String code) {
        return lambdaQuery().eq(DictType::getCode, code).one();
    }

    public List<DictOption> listEnum(String enumName) {
        Class<? extends IEnum> clazz = null;

        if (enumClassCache.containsKey(enumName)) {
            clazz = (Class<? extends IEnum>) enumClassCache.get(enumName);
            return FaEnumUtils.toOptions(clazz);
        }

        Set<Class<?>> set = ClassUtil.scanPackage("com.faber", i -> {
            return IEnum.class.isAssignableFrom(i) && StrUtil.equals(i.getSimpleName(), enumName);
        });
        if (set.size() == 0) throw new NoDataException();
        if (set.size() >  1) throw new BuzzException("找到多个同名的枚举【" + enumName + "】，请联系管理员");

        if (set.iterator().hasNext()) {
            clazz = (Class<? extends IEnum>) set.iterator().next();
            enumClassCache.put(enumName, clazz);
            return FaEnumUtils.toOptions(clazz);
        }
        throw new BuzzException("未找到或找到多个同名的枚举【" + enumName + "】，请联系管理员");
    }

    /**
     * 获取系统参数配置
     * @return
     */
    public SystemConfigPo getSystemConfig() {
        DictType dictType = getByCode("system");

        Map<String, Object> map = new HashMap<>();
        for (DictType.Dict dict : dictType.getDicts()) {
            map.put(dict.getLabel(), dict.getValue());
        }

        SystemConfigPo po = new SystemConfigPo();
        // 系统服务配置
        po.setTitle(MapUtil.getStr(map, "system:title"));
        po.setSubTitle(MapUtil.getStr(map, "system:subTitle"));
        po.setLogo(MapUtil.getStr(map, "system:logo"));
        po.setLogoWithText(MapUtil.getStr(map, "system:portal:logoWithText"));
        po.setPortalLink(MapUtil.getStr(map, "system:portal:link"));

        // 配置文件中的配置
        po.setPhpRedisAdmin(faSetting.getUrl().getPhpRedisAdmin());
        po.setSocketUrl(faSetting.getUrl().getSocketUrl());

        return po;
    }

}

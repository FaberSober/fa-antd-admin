package com.faber.api.base.admin.biz;

import cn.hutool.core.util.ClassUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.faber.api.base.admin.entity.Dict;
import com.faber.api.base.admin.mapper.DictMapper;
import com.faber.core.exception.BuzzException;
import com.faber.core.exception.NoDataException;
import com.faber.core.utils.FaEnumUtils;
import com.faber.core.vo.utils.DictOption;
import com.faber.core.web.biz.BaseTreeBiz;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 字典
 */
@Service
public class DictBiz extends BaseTreeBiz<DictMapper, Dict> {

    private static final Map<String, Object> enumClassCache = new HashMap<>();

    @Override
    public boolean save(Dict entity) {
        // 插入时校验编码是否重复
        long count = lambdaQuery().eq(Dict::getCode, entity.getCode()).count();
        if (count > 0) throw new BuzzException("字典分组编码重复");

        return super.save(entity);
    }

    @Override
    public boolean updateById(Dict entity) {
        if (entity.getParentId() == entity.getId().intValue()) {
            throw new BuzzException("父节点不能是自身");
        }

        // 插入时校验编码是否重复
        long count = lambdaQuery()
                .eq(Dict::getCode, entity.getCode())
                .ne(Dict::getId, entity.getId())
                .count();
        if (count > 0) throw new BuzzException("字典分组编码重复");

        return super.updateById(entity);
    }

    @Override
    public boolean removeById(Serializable id) {
        List<Dict> list = super.getAllChildrenFromNode(id);
        for (Dict o : list) {
            // 1. 逻辑删除字典类型
            super.removeById(o.getId());
        }
        return true;
    }

    public Dict getByCode(String code) {
        return lambdaQuery().eq(Dict::getCode, code).one();
    }

    public <T extends Serializable> List<DictOption<T>> listEnum(String enumName) {
        Class<? extends IEnum<T>> clazz = null;

        if (enumClassCache.containsKey(enumName)) {
            clazz = (Class<? extends IEnum<T>>) enumClassCache.get(enumName);
            return FaEnumUtils.toOptions(clazz);
        }

        Set<Class<?>> set = ClassUtil.scanPackage("com.faber", i -> {
            return IEnum.class.isAssignableFrom(i) && StrUtil.equals(i.getSimpleName(), enumName);
        });
        if (set.size() == 0) throw new NoDataException();
        if (set.size() >  1) throw new BuzzException("找到多个同名的枚举【" + enumName + "】，请联系管理员");

        if (set.iterator().hasNext()) {
            clazz = (Class<? extends IEnum<T>>) set.iterator().next();
            enumClassCache.put(enumName, clazz);
            return FaEnumUtils.toOptions(clazz);
        }
        throw new BuzzException("未找到或找到多个同名的枚举【" + enumName + "】，请联系管理员");
    }

}

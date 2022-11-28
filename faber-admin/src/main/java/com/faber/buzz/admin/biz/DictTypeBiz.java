package com.faber.buzz.admin.biz;

import com.faber.buzz.admin.entity.Dict;
import com.faber.buzz.admin.entity.DictType;
import com.faber.buzz.admin.mapper.DictTypeMapper;
import com.faber.core.web.biz.BaseTreeBiz;
import com.faber.core.exception.BuzzException;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.Serializable;
import java.util.List;

/**
 * 字典分类
 */
@Service
public class DictTypeBiz extends BaseTreeBiz<DictTypeMapper, DictType> {

    @Resource
    private DictBiz dictBiz;

    @Override
    public boolean save(DictType entity) {
        // 插入时校验编码是否重复
        long count = lambdaQuery().eq(DictType::getCode, entity.getCode()).count();
        if (count > 0) throw new BuzzException("字典分组编码重复");

        super.setNextSort(entity); // 设置entity的排序

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

            // 2. 逻辑删除关联字典值
            List<Dict> dictList = dictBiz.getByDictTypeId(o.getId());
            for (Dict dict : dictList) {
                dictBiz.removeById(dict.getId());
            }
        }

        return true;
    }

}

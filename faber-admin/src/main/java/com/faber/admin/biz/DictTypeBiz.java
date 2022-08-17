package com.faber.admin.biz;

import com.faber.admin.entity.Dict;
import com.faber.admin.entity.DictType;
import com.faber.admin.mapper.DictTypeMapper;
import com.faber.common.bean.BaseDelEntity;
import com.faber.common.biz.BaseTreeBiz;
import com.faber.common.exception.BuzzException;
import org.springframework.stereotype.Service;
import tk.mybatis.mapper.entity.Example;

import javax.annotation.Resource;
import java.util.List;

/**
 * 字典分类
 */
@Service
public class DictTypeBiz extends BaseTreeBiz<DictTypeMapper, DictType> {

    @Resource
    private DictBiz dictBiz;

    @Override
    public void insertSelective(DictType entity) {
        // 插入时校验编码是否重复
        Example example = new Example(DictType.class);
        example.createCriteria()
                .andEqualTo("code", entity.getCode())
                .andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE);
        int count = mapper.selectCountByExample(example);
        if (count > 0) throw new BuzzException("字典分组编码重复");

        super.setNextSort(entity); // 设置entity的排序

        super.insertSelective(entity);
    }

    @Override
    public void updateSelectiveById(DictType entity) {
        if (entity.getParentId() == entity.getId().intValue()) {
            throw new BuzzException("父节点不能是自身");
        }

        // 插入时校验编码是否重复
        Example example = new Example(DictType.class);
        example.createCriteria()
                .andEqualTo("code", entity.getCode())
                .andNotEqualTo("id", entity.getId())
                .andEqualTo("delState", BaseDelEntity.DEL_STATE.AVAILABLE);
        int count = mapper.selectCountByExample(example);
        if (count > 0) throw new BuzzException("字典分组编码重复");

        super.updateSelectiveById(entity);
    }

    @Override
    public void deleteById(Object id) {
        List<DictType> list = super.getAllChildrenFromNode(id);
        for (DictType o : list) {
            // 1. 逻辑删除字典类型
            super.logicDeleteById(o.getId());

            // 2. 逻辑删除关联字典值
            List<Dict> dictList = dictBiz.getByDictTypeId(o.getId());
            for (Dict dict : dictList) {
                dictBiz.logicDeleteById(dict.getId());
            }
        }
    }

}

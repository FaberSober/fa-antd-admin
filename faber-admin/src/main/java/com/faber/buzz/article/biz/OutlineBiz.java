package com.faber.buzz.article.biz;

import cn.hutool.core.bean.BeanUtil;
import com.faber.buzz.article.entity.Detail;
import com.faber.buzz.article.entity.Outline;
import com.faber.buzz.article.mapper.OutlineMapper;
import com.faber.buzz.article.vo.OutlineDetailVo;
import com.faber.common.biz.BaseTreeBiz;
import com.faber.common.constant.CommonConstants;
import com.faber.common.exception.BuzzException;
import com.faber.common.vo.tree.TreeNode;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.Serializable;
import java.util.List;

/**
 * 文章-大纲
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-12-31 13:53:39
 */
@Service
public class OutlineBiz extends BaseTreeBiz<OutlineMapper, Outline> {

    @Resource
    private DetailBiz detailBiz;

    @Override
    public boolean save(Outline entity) {
        super.setNextSort(entity); // 设置entity的排序
        return super.save(entity);
    }

    @Override
    public boolean updateById(Outline entity) {
        if (entity.getParentId() == entity.getId().intValue()) {
            throw new BuzzException("父节点不能是自身");
        }
        return super.updateById(entity);
    }

    public OutlineDetailVo findDetail(Serializable id) {
        Outline entity = getById(id);

        OutlineDetailVo vo = new OutlineDetailVo();
        BeanUtil.copyProperties(entity, vo);

        // 查找文章详情
        Detail detail = null;
        if (vo.getDetailId() != null) {
            detail = detailBiz.getById(vo.getDetailId());
        }
        if (detail == null) {
            detail = detailBiz.createByOutlineId(vo.getId());
        }
        vo.setDetail(detail);

        if (entity.getDetailId() == null || entity.getDetailId().intValue() != detail.getId()) {
            entity.setDetailId(detail.getId());
            this.updateById(entity);
        }

        return vo;
    }

    public List<TreeNode<Outline>> allTree(int bookId) {
        List<Outline> beanList = lambdaQuery()
                .eq(Outline::getBookId, bookId)
                .orderByAsc(Outline::getSort)
                .list();
        return this.getMenuTree(beanList, CommonConstants.ROOT);
    }

}

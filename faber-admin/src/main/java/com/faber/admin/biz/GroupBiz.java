package com.faber.admin.biz;

import cn.hutool.core.util.ObjectUtil;
import com.faber.admin.entity.Group;
import com.faber.admin.mapper.GroupMapper;
import com.faber.common.biz.BaseTreeBiz;
import com.faber.common.exception.BuzzException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.io.Serializable;
import java.util.List;

/**
 * 群组权限
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class GroupBiz extends BaseTreeBiz<GroupMapper, Group> {

    @Resource
    private GroupUserBiz groupUserBiz;

    @Override
    public boolean save(Group entity) {
        if (entity.getParentId() == null) {
            throw new BuzzException("父节点不能为空");
        }

        // 插入时校验编码是否重复
        long count = lambdaQuery().eq(Group::getCode, entity.getCode()).count();
        if (count > 0) throw new BuzzException("角色编码重复");

        super.setNextSort(entity); // 设置entity的排序

        return super.save(entity);
    }

    @Override
    public boolean updateById(Group entity) {
        if (entity.getParentId() == entity.getId().intValue()) {
            throw new BuzzException("父节点不能是自身");
        }

        // 插入时校验编码是否重复
        long count = lambdaQuery()
                .eq(Group::getCode, entity.getCode())
                .ne(Group::getId, entity.getId())
                .count();
        if (count > 0) throw new BuzzException("角色编码重复");

        return super.updateById(entity);
    }

    @Override
    public boolean removeById(Serializable id) {
        if (ObjectUtil.equal(id, "1")) {
            throw new BuzzException("默认管理员角色不可删除");
        }

        List<Group> list = super.getAllChildrenFromNode(id);
        for (Group o : list) {
            // 1. 逻辑删除角色分组
            super.removeById(o.getId());
        }

        // 2. 逻辑删除角色分组关联用户
        groupUserBiz.getBaseMapper().deleteNotValidGroupUsers();

        return super.removeById(id);
    }

}

package com.faber.rbac.biz;

import cn.hutool.core.util.ObjectUtil;
import com.faber.admin.entity.Department;
import com.faber.admin.entity.User;
import com.faber.common.biz.BaseTreeBiz;
import com.faber.common.exception.BuzzException;
import com.faber.rbac.entity.RbacMenu;
import com.faber.rbac.mapper.RbacMenuMapper;
import org.springframework.stereotype.Service;

import java.io.Serializable;

/**
 * BASE-权限表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@Service
public class RbacMenuBiz extends BaseTreeBiz<RbacMenuMapper,RbacMenu> {

    @Override
    public boolean save(RbacMenu entity) {
        super.setNextSort(entity);

        long count = lambdaQuery().eq(RbacMenu::getLinkUrl, entity.getLinkUrl()).count();
        if (count > 0) throw new BuzzException("链接已存在，不可重复录入");

        return super.save(entity);
    }

    @Override
    public boolean updateById(RbacMenu entity) {
        if (ObjectUtil.equal(entity.getParentId(), entity.getId())) {
            throw new BuzzException("父节点不能是自身");
        }

        long count = lambdaQuery().eq(RbacMenu::getLinkUrl, entity.getLinkUrl()).ne(RbacMenu::getId, entity.getId()).count();
        if (count > 0) throw new BuzzException("链接已存在，不可重复录入");

        return super.updateById(entity);
    }

}
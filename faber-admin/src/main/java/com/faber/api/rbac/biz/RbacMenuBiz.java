package com.faber.api.rbac.biz;

import cn.hutool.core.util.ObjectUtil;
import com.faber.api.rbac.entity.RbacMenu;
import com.faber.api.rbac.mapper.RbacMenuMapper;
import com.faber.core.config.redis.annotation.FaCacheClear;
import com.faber.core.exception.BuzzException;
import com.faber.core.web.biz.BaseTreeBiz;
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
public class RbacMenuBiz extends BaseTreeBiz<RbacMenuMapper, RbacMenu> {

    @FaCacheClear(pre = "rbac:")
    @Override
    public boolean save(RbacMenu entity) {
        long count = lambdaQuery().eq(RbacMenu::getLinkUrl, entity.getLinkUrl()).count();
        if (count > 0) throw new BuzzException("链接已存在，不可重复录入");

        return super.save(entity);
    }

    @FaCacheClear(pre = "rbac:")
    @Override
    public boolean updateById(RbacMenu entity) {
        if (ObjectUtil.equal(entity.getParentId(), entity.getId())) {
            throw new BuzzException("父节点不能是自身");
        }

        long count = lambdaQuery().eq(RbacMenu::getLinkUrl, entity.getLinkUrl()).ne(RbacMenu::getId, entity.getId()).count();
        if (count > 0) throw new BuzzException("链接已存在，不可重复录入");

        return super.updateById(entity);
    }

    @FaCacheClear(pre = "rbac:")
    @Override
    public boolean removeById(Serializable id) {
        return super.removeById(id);
    }
}
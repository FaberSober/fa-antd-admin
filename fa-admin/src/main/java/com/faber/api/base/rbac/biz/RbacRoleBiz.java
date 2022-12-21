package com.faber.api.base.rbac.biz;

import com.faber.api.base.rbac.mapper.RbacRoleMapper;
import com.faber.api.base.rbac.entity.RbacRole;
import com.faber.core.config.redis.annotation.FaCacheClear;
import com.faber.core.web.biz.BaseBiz;
import org.springframework.stereotype.Service;

import java.io.Serializable;

/**
 * BASE-角色表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@Service
public class RbacRoleBiz extends BaseBiz<RbacRoleMapper, RbacRole> {

    @FaCacheClear(pre = "rbac:")
    @Override
    public boolean save(RbacRole entity) {
        return super.save(entity);
    }

    @FaCacheClear(pre = "rbac:")
    @Override
    public boolean updateById(RbacRole entity) {
        return super.updateById(entity);
    }

    @FaCacheClear(pre = "rbac:")
    @Override
    public boolean removeById(Serializable id) {
        return super.removeById(id);
    }

}
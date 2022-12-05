package com.faber.api.rbac.biz;

import com.faber.api.rbac.entity.RbacRole;
import com.faber.api.rbac.mapper.RbacRoleMapper;
import com.faber.core.web.biz.BaseBiz;
import org.springframework.stereotype.Service;

/**
 * BASE-角色表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@Service
public class RbacRoleBiz extends BaseBiz<RbacRoleMapper, RbacRole> {
}
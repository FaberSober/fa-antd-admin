package com.faber.rbac.biz;

import com.faber.common.biz.BaseBiz;
import com.faber.rbac.entity.RbacRole;
import com.faber.rbac.mapper.RbacRoleMapper;
import org.springframework.stereotype.Service;

/**
 * BASE-角色表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@Service
public class RbacRoleBiz extends BaseBiz<RbacRoleMapper,RbacRole> {
}
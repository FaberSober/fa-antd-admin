package com.faber.rbac.biz;

import org.springframework.stereotype.Service;

import com.faber.rbac.entity.RbacUserRole;
import com.faber.rbac.mapper.RbacUserRoleMapper;
import com.faber.common.biz.BaseBiz;

/**
 * BASE-用户角色关联表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@Service
public class RbacUserRoleBiz extends BaseBiz<RbacUserRoleMapper,RbacUserRole> {
}
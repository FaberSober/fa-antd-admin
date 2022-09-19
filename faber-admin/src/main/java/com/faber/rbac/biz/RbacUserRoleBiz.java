package com.faber.rbac.biz;

import com.faber.common.biz.BaseBiz;
import com.faber.rbac.entity.RbacUserRole;
import com.faber.rbac.mapper.RbacUserRoleMapper;
import org.springframework.stereotype.Service;

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
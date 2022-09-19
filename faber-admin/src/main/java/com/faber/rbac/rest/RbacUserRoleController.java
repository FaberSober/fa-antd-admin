package com.faber.rbac.rest;

import com.faber.common.rest.BaseController;
import com.faber.rbac.biz.RbacUserRoleBiz;
import com.faber.rbac.entity.RbacUserRole;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * BASE-用户角色关联表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@RestController
@RequestMapping("/api/rbac/rbacUserRole")
public class RbacUserRoleController extends BaseController<RbacUserRoleBiz,RbacUserRole, Long> {

}
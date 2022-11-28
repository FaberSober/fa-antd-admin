package com.faber.buzz.rbac.rest;

import com.faber.buzz.rbac.entity.RbacRole;
import com.faber.core.web.rest.BaseController;
import com.faber.buzz.rbac.biz.RbacRoleBiz;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * BASE-角色表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@RestController
@RequestMapping("/api/rbac/rbacRole")
public class RbacRoleController extends BaseController<RbacRoleBiz, RbacRole, Long> {

}
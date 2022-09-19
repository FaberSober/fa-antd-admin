package com.faber.rbac.rest;

import com.faber.common.rest.BaseController;
import com.faber.rbac.biz.RbacRoleBiz;
import com.faber.rbac.entity.RbacRole;
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
public class RbacRoleController extends BaseController<RbacRoleBiz,RbacRole> {

}
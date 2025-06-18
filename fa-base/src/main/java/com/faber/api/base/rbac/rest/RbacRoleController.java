package com.faber.api.base.rbac.rest;

import com.faber.api.base.rbac.biz.RbacRoleBiz;
import com.faber.api.base.rbac.entity.RbacRole;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * BASE-角色表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@FaLogBiz("角色")
@RestController
@RequestMapping("/api/base/rbac/rbacRole")
public class RbacRoleController extends BaseController<RbacRoleBiz, RbacRole, Long> {

}
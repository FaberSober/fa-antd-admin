package com.faber.rbac.rest;

import com.faber.common.rest.BaseController;
import com.faber.rbac.biz.RbacRoleMenuBiz;
import com.faber.rbac.entity.RbacRoleMenu;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * BASE-角色权限对应表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@RestController
@RequestMapping("/api/rbac/rbacRoleMenu")
public class RbacRoleMenuController extends BaseController<RbacRoleMenuBiz,RbacRoleMenu> {

}
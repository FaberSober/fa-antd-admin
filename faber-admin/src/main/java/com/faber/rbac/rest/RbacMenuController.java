package com.faber.rbac.rest;

import com.faber.common.rest.BaseTreeController;
import com.faber.rbac.biz.RbacMenuBiz;
import com.faber.rbac.entity.RbacMenu;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * BASE-权限表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@RestController
@RequestMapping("/api/rbac/rbacMenu")
public class RbacMenuController extends BaseTreeController<RbacMenuBiz, RbacMenu> {

}
package com.faber.api.rbac.rest;

import com.faber.core.web.rest.BaseTreeController;
import com.faber.api.rbac.biz.RbacMenuBiz;
import com.faber.api.rbac.entity.RbacMenu;
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
public class RbacMenuController extends BaseTreeController<RbacMenuBiz, RbacMenu, Long> {

}
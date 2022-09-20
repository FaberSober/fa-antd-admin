package com.faber.rbac.biz;

import com.faber.common.biz.BaseBiz;
import com.faber.rbac.entity.RbacMenu;
import com.faber.rbac.entity.RbacRole;
import com.faber.rbac.entity.RbacRoleMenu;
import com.faber.rbac.entity.RbacUserRole;
import com.faber.rbac.mapper.RbacUserRoleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * BASE-用户角色关联表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@Service
public class RbacUserRoleBiz extends BaseBiz<RbacUserRoleMapper,RbacUserRole> {

    @Autowired
    private RbacRoleBiz rbacRoleBiz;

    @Autowired
    private RbacRoleMenuBiz rbacRoleMenuBiz;

    @Autowired
    private RbacMenuBiz rbacMenuBiz;

    public List<Long> getMyRoleIds() {
        List<RbacUserRole> userRoleList = lambdaQuery().eq(RbacUserRole::getUserId, getCurrentUserId()).list();
        return userRoleList.stream().map(RbacUserRole::getRoleId).collect(Collectors.toList());
    }

    public List<RbacRole> getMyRoles() {
        List<Long> roleIds = this.getMyRoleIds();
        if (roleIds.isEmpty()) return new ArrayList<>();

        return rbacRoleBiz.lambdaQuery().in(RbacRole::getId, roleIds).list();
    }

    public List<RbacMenu> getMyMenus() {
        List<Long> roleIds = this.getMyRoleIds();
        if (roleIds.isEmpty()) return new ArrayList<>();

        List<RbacRoleMenu> roleMenuList = rbacRoleMenuBiz.lambdaQuery().in(RbacRoleMenu::getRoleId, roleIds).list();
        List<Long> menuIds = roleMenuList.stream().map(RbacRoleMenu::getMenuId).collect(Collectors.toList());
        if (menuIds.isEmpty()) return new ArrayList<>();

        return rbacMenuBiz.lambdaQuery().in(RbacMenu::getId, menuIds).list();
    }

}
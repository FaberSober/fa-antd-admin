package com.faber.rbac.biz;

import com.faber.common.biz.BaseBiz;
import com.faber.common.constant.CommonConstants;
import com.faber.common.enums.BoolEnum;
import com.faber.common.exception.BuzzException;
import com.faber.common.msg.TableResultResponse;
import com.faber.common.vo.TreeNode;
import com.faber.rbac.entity.RbacMenu;
import com.faber.rbac.entity.RbacRole;
import com.faber.rbac.entity.RbacRoleMenu;
import com.faber.rbac.entity.RbacUserRole;
import com.faber.rbac.mapper.RbacUserRoleMapper;
import com.faber.rbac.vo.RbacUserRoleRetVo;
import com.faber.rbac.vo.query.RbacUserRoleQueryVo;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.ArrayList;
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

    @Override
    public boolean removeById(Serializable id) {
        if ((Long)id == 1L) {
            throw new BuzzException("不能删除默认的超级管理员角色");
        }
        return super.removeById(id);
    }

    public List<Long> getMyRoleIds() {
        List<RbacUserRole> userRoleList = lambdaQuery().eq(RbacUserRole::getUserId, getCurrentUserId()).list();
        return userRoleList.stream().map(RbacUserRole::getRoleId).collect(Collectors.toList());
    }

    public List<RbacRole> getMyRoles() {
        List<Long> roleIds = this.getMyRoleIds();
        if (roleIds.isEmpty()) return new ArrayList<>();

        return rbacRoleBiz.lambdaQuery().eq(RbacRole::getStatus, BoolEnum.YES).in(RbacRole::getId, roleIds).list();
    }

    public List<RbacMenu> getMyMenus() {
        List<Long> roleIds = this.getMyRoles().stream().map(RbacRole::getId).collect(Collectors.toList());
        if (roleIds.isEmpty()) return new ArrayList<>();

        List<RbacRoleMenu> roleMenuList = rbacRoleMenuBiz.lambdaQuery().in(RbacRoleMenu::getRoleId, roleIds).list();
        List<Long> menuIds = roleMenuList.stream().map(RbacRoleMenu::getMenuId).collect(Collectors.toList());
        if (menuIds.isEmpty()) return new ArrayList<>();

        return rbacMenuBiz.lambdaQuery().in(RbacMenu::getId, menuIds).list();
    }

    public List<TreeNode<RbacMenu>> getMyMenusTree() {
        List<RbacMenu> list = this.getMyMenus();
        return rbacMenuBiz.getMenuTree(list, CommonConstants.ROOT);
    }

    public TableResultResponse<RbacUserRoleRetVo> pageVo(RbacUserRoleQueryVo query) {
        PageInfo<RbacUserRoleRetVo> info = PageHelper.startPage(query.getCurrentPage(), query.getPageSize())
                .doSelectPageInfo(() -> baseMapper.pageVo(query));
        return new TableResultResponse<>(info);
    }

}
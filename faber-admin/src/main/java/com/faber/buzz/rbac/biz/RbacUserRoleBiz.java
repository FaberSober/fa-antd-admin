package com.faber.buzz.rbac.biz;

import cn.hutool.core.util.StrUtil;
import com.faber.buzz.rbac.entity.RbacMenu;
import com.faber.buzz.rbac.entity.RbacRole;
import com.faber.buzz.rbac.entity.RbacRoleMenu;
import com.faber.buzz.rbac.entity.RbacUserRole;
import com.faber.buzz.rbac.mapper.RbacUserRoleMapper;
import com.faber.buzz.rbac.vo.RbacUserRoleRetVo;
import com.faber.buzz.rbac.vo.query.RbacUserRoleQueryVo;
import com.faber.common.biz.BaseBiz;
import com.faber.common.constant.CommonConstants;
import com.faber.common.enums.BoolEnum;
import com.faber.common.exception.BuzzException;
import com.faber.common.vo.TreeNode;
import com.faber.common.vo.msg.TableRet;
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
public class RbacUserRoleBiz extends BaseBiz<RbacUserRoleMapper, RbacUserRole> {

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

    public List<Long> getUserRoleIds(String userId) {
        List<RbacUserRole> userRoleList = lambdaQuery().eq(RbacUserRole::getUserId, userId).list();
        return userRoleList.stream().map(RbacUserRole::getRoleId).collect(Collectors.toList());
    }

    public List<RbacRole> getUserRoles(String userId) {
        List<Long> roleIds = this.getUserRoleIds(userId);
        if (roleIds.isEmpty()) return new ArrayList<>();

        return rbacRoleBiz.lambdaQuery().eq(RbacRole::getStatus, BoolEnum.YES).in(RbacRole::getId, roleIds).list();
    }

    public List<RbacMenu> getUserMenus(String userId) {
        List<Long> roleIds = this.getUserRoleIds(userId);
        if (roleIds.isEmpty()) return new ArrayList<>();

        List<RbacRoleMenu> roleMenuList = rbacRoleMenuBiz.lambdaQuery().in(RbacRoleMenu::getRoleId, roleIds).list();
        List<Long> menuIds = roleMenuList.stream().map(RbacRoleMenu::getMenuId).collect(Collectors.toList());
        if (menuIds.isEmpty()) return new ArrayList<>();

        return rbacMenuBiz.lambdaQuery().in(RbacMenu::getId, menuIds).orderByAsc(RbacMenu::getSort).list();
    }

    public List<TreeNode<RbacMenu>> getUserMenusTree(String userId) {
        List<RbacMenu> list = this.getUserMenus(userId);
        return rbacMenuBiz.getMenuTree(list, CommonConstants.ROOT);
    }

    /**
     * 校验用户是否有该权限点{@link RbacMenu#getLinkUrl()}
     * @param userId
     * @param linkUrl
     * @return
     */
    public boolean checkUserLinkUrl(String userId, String linkUrl) {
        return baseMapper.countByUserIdAndLinkUrl(userId, linkUrl) > 0;
    }

    public TableRet<RbacUserRoleRetVo> pageVo(RbacUserRoleQueryVo query) {
        PageInfo<RbacUserRoleRetVo> info = PageHelper.startPage(query.getCurrent(), query.getPageSize())
                .doSelectPageInfo(() -> baseMapper.pageVo(query));
        return new TableRet<>(info);
    }

    /**
     * 修改用户角色关联
     * @param userId
     * @param roleIds
     */
    public void changeUserRoles(String userId, List<Long> roleIds) {
        if (StrUtil.isEmpty(userId)) throw new BuzzException("用户ID不能为空");
        if (roleIds == null || roleIds.isEmpty()) throw new BuzzException("更新需要指定角色ID");

        // 删除之前的角色关联
        lambdaQuery().eq(RbacUserRole::getUserId, userId).list().forEach(item -> {
            super.removeById(item.getId());
        });

        // 绑定新的角色关联
        for (Long roleId : roleIds) {
            RbacUserRole userRole = new RbacUserRole();
            userRole.setUserId(userId);
            userRole.setRoleId(roleId);
            this.save(userRole);
        }
    }

}
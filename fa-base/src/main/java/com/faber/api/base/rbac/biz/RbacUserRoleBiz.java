package com.faber.api.base.rbac.biz;

import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.util.StrUtil;
//import com.alicp.jetcache.anno.Cached;
import com.faber.api.base.rbac.entity.RbacMenu;
import com.faber.api.base.rbac.entity.RbacRole;
import com.faber.api.base.rbac.entity.RbacRoleMenu;
import com.faber.api.base.rbac.entity.RbacUserRole;
import com.faber.api.base.rbac.enums.RbacMenuScopeEnum;
import com.faber.api.base.rbac.mapper.RbacUserRoleMapper;
import com.faber.api.base.rbac.vo.RbacUserRoleRetVo;
import com.faber.api.base.rbac.vo.req.RbacUserRoleQueryVo;
import com.faber.api.base.rbac.vo.req.RbacUserRoleUpdateVo;
import com.faber.api.base.rbac.vo.req.RbacUserRolesVo;
import com.faber.core.config.redis.annotation.FaCacheClear;
import com.faber.core.constant.CommonConstants;
import com.faber.core.exception.BuzzException;
import com.faber.core.vo.msg.TableRet;
import com.faber.core.vo.query.BasePageQuery;
import com.faber.core.vo.tree.TreeNode;
import com.faber.core.web.biz.BaseBiz;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @FaCacheClear(pre = "rbac:")
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

        return rbacRoleBiz.lambdaQuery().eq(RbacRole::getStatus, true).in(RbacRole::getId, roleIds).list();
    }

    public List<RbacMenu> getUserMenus(String userId, RbacMenuScopeEnum scope) {
        List<Long> roleIds = this.getUserRoleIds(userId);
        if (roleIds.isEmpty()) return new ArrayList<>();

        List<RbacRoleMenu> roleMenuList = rbacRoleMenuBiz.lambdaQuery()
                .in(RbacRoleMenu::getRoleId, roleIds)
                .list();
        List<Long> menuIds = roleMenuList.stream().map(RbacRoleMenu::getMenuId).collect(Collectors.toList());
        if (menuIds.isEmpty()) return new ArrayList<>();

        return rbacMenuBiz.lambdaQuery()
                .eq(RbacMenu::getStatus, true)
                .eq(RbacMenu::getScope, scope)
                .in(RbacMenu::getId, menuIds)
                .orderByAsc(RbacMenu::getSort)
                .list();
    }

//    @Cached(name="rbac:userMenus:", key="#userId")
    public List<TreeNode<RbacMenu>> getUserMenusTree(String userId, RbacMenuScopeEnum scope) {
        List<RbacMenu> list = this.getUserMenus(userId, scope);
        return rbacMenuBiz.listToTree(list, CommonConstants.ROOT);
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

    public TableRet<RbacUserRoleRetVo> pageVo(BasePageQuery<RbacUserRoleQueryVo> query) {
        PageInfo<RbacUserRoleRetVo> info = PageHelper.startPage(query.getCurrent(), query.getPageSize())
                .doSelectPageInfo(() -> baseMapper.pageVo(query.getQuery(), query.getSorter()));
        return new TableRet<>(info);
    }

    public void changeUserRoles(String userId, Long roleId) {
        this.changeUserRoles(userId, ListUtil.toList(roleId));
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

    public void addUsers(RbacUserRoleUpdateVo param) {
        Long roleId = param.getRoleId();
        for (String userId : param.getUserIds()) {
            long count = lambdaQuery()
                    .eq(RbacUserRole::getUserId, userId)
                    .eq(RbacUserRole::getRoleId, roleId)
                    .count();
            if (count == 1) continue;

            if (count > 0) {
                lambdaUpdate()
                        .eq(RbacUserRole::getUserId, userId)
                        .eq(RbacUserRole::getRoleId, roleId)
                        .remove();
            }

            RbacUserRole userRole = new RbacUserRole();
            userRole.setUserId(userId);
            userRole.setRoleId(roleId);
            this.save(userRole);
        }
    }

    @Transactional
    @FaCacheClear(pre = "rbac:")
    public void updateUserRoles(RbacUserRolesVo params) {
        lambdaUpdate()
                .eq(RbacUserRole::getUserId, params.getUserId())
                .remove();

        for (Long roleId : params.getRoleIds()) {
            RbacUserRole userRole = new RbacUserRole();
            userRole.setUserId(params.getUserId());
            userRole.setRoleId(roleId);
            this.save(userRole);
        }
    }

}
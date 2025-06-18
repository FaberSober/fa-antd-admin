package com.faber.api.base.rbac.biz;

import com.faber.api.base.rbac.entity.RbacRoleMenu;
import com.faber.api.base.rbac.mapper.RbacRoleMenuMapper;
import com.faber.api.base.rbac.vo.RoleMenuVo;
import com.faber.core.config.redis.annotation.FaCacheClear;
import com.faber.core.web.biz.BaseBiz;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * BASE-角色权限对应表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@Service
public class RbacRoleMenuBiz extends BaseBiz<RbacRoleMenuMapper, RbacRoleMenu> {

    @Lazy
    @Resource
    RbacMenuBiz rbacMenuBiz;

    @FaCacheClear(pre = "rbac:")
    @Override
    public boolean save(RbacRoleMenu entity) {
        return super.save(entity);
    }

    @FaCacheClear(pre = "rbac:")
    @Override
    public boolean updateById(RbacRoleMenu entity) {
        return super.updateById(entity);
    }

    @FaCacheClear(pre = "rbac:")
    @Override
    public boolean removeById(Serializable id) {
        return super.removeById(id);
    }

    public List<Long> getMenuIdsWithHalfCheck(Long roleId) {
        return lambdaQuery()
                .eq(RbacRoleMenu::getRoleId, roleId)
                .list()
                .stream()
                .map(RbacRoleMenu::getMenuId)
                .collect(Collectors.toList());
    }

    public RoleMenuVo getRoleMenu(Long roleId) {
        RoleMenuVo vo = new RoleMenuVo();
        vo.setRoleId(roleId);
        vo.setCheckedMenuIds(this.getMenuIdsWithHalfCheck(roleId));
        return vo;
    }

    @FaCacheClear(pre = "rbac:")
    public void updateRoleMenu(RoleMenuVo roleMenuVo) {
        long roleId = roleMenuVo.getRoleId();
        // 删除之前的角色
        lambdaUpdate().eq(RbacRoleMenu::getRoleId, roleId).remove();

        List<RbacRoleMenu> list = new ArrayList<>();
        for (Long menuId : roleMenuVo.getCheckedMenuIds()) {
            list.add(new RbacRoleMenu(null, roleId, menuId, false));
        }
//        for (Long menuId : roleMenuVo.getHalfCheckedMenuIds()) {
//            list.add(new RbacRoleMenu(null, roleId, menuId, true));
//        }

        this.saveBatch(list);
    }

    /**
     * 系统第一次启动时，初始化"超级管理员"角色的权限（赋全部权限）
     */
    public void initAdminRoleMenu() {
        // 如果角色权限表已经有数据，则不做初始化
        if (this.count() > 0) return;

        List<RbacRoleMenu> roleMenuList = rbacMenuBiz.list().stream().map(i -> {
            return new RbacRoleMenu(null, 1L, i.getId(), false);
        }).collect(Collectors.toList());

        this.saveBatch(roleMenuList);
    }

}
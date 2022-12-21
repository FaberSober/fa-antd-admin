package com.faber.api.base.rbac.biz;

import com.faber.api.base.rbac.mapper.RbacRoleMenuMapper;
import com.faber.api.base.rbac.entity.RbacRoleMenu;
import com.faber.api.base.rbac.vo.RoleMenuVo;
import com.faber.core.config.redis.annotation.FaCacheClear;
import com.faber.core.web.biz.BaseBiz;
import org.springframework.stereotype.Service;

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

    public List<Long> getMenuIdsWithHalfCheck(Long roleId, Boolean bool) {
        return lambdaQuery()
                .eq(RbacRoleMenu::getRoleId, roleId)
                .eq(RbacRoleMenu::getHalfChecked, bool)
                .list()
                .stream()
                .map(RbacRoleMenu::getMenuId)
                .collect(Collectors.toList());
    }

    public RoleMenuVo getRoleMenu(Long roleId) {
        RoleMenuVo vo = new RoleMenuVo();
        vo.setRoleId(roleId);
        vo.setCheckedRoleIds(this.getMenuIdsWithHalfCheck(roleId, false));
        vo.setHalfCheckedRoleIds(this.getMenuIdsWithHalfCheck(roleId, true));
        return vo;
    }

    @FaCacheClear(pre = "rbac:")
    public void updateRoleMenu(RoleMenuVo roleMenuVo) {
        long roleId = roleMenuVo.getRoleId();
        // 删除之前的角色
        lambdaUpdate().eq(RbacRoleMenu::getRoleId, roleId).remove();

        List<RbacRoleMenu> list = new ArrayList<>();
        for (Long menuId : roleMenuVo.getCheckedRoleIds()) {
            list.add(new RbacRoleMenu(null, roleId, menuId, false));
        }
        for (Long menuId : roleMenuVo.getHalfCheckedRoleIds()) {
            list.add(new RbacRoleMenu(null, roleId, menuId, true));
        }

        this.saveBatch(list);
    }

}
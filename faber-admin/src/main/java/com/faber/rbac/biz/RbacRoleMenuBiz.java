package com.faber.rbac.biz;

import com.faber.common.biz.BaseBiz;
import com.faber.common.enums.BoolEnum;
import com.faber.rbac.entity.RbacRoleMenu;
import com.faber.rbac.mapper.RbacRoleMenuMapper;
import com.faber.rbac.vo.UpdateRoleMenuVo;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * BASE-角色权限对应表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@Service
public class RbacRoleMenuBiz extends BaseBiz<RbacRoleMenuMapper, RbacRoleMenu> {

    public void updateRoleMenu(UpdateRoleMenuVo updateRoleMenuVo) {
        long roleId = updateRoleMenuVo.getRoleId();
        // 删除之前的角色
        lambdaUpdate().eq(RbacRoleMenu::getRoleId, roleId).remove();

        List<RbacRoleMenu> list = new ArrayList<>();
        for (Long menuId : updateRoleMenuVo.getCheckedRoleIds()) {
            list.add(new RbacRoleMenu().setRoleId(roleId).setMenuId(menuId).setHalfChecked(BoolEnum.NO));
        }
        for (Long menuId : updateRoleMenuVo.getHalfCheckedRoleIds()) {
            list.add(new RbacRoleMenu().setRoleId(roleId).setMenuId(menuId).setHalfChecked(BoolEnum.YES));
        }

        this.saveBatch(list);
    }

}
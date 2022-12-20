package com.faber.api.base.rbac.rest;

import com.faber.api.base.rbac.biz.RbacRoleMenuBiz;
import com.faber.api.base.rbac.entity.RbacRoleMenu;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import com.faber.api.base.rbac.vo.RoleMenuVo;
import org.springframework.web.bind.annotation.*;

/**
 * BASE-角色权限对应表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@FaLogBiz("角色权限")
@RestController
@RequestMapping("/api/base/rbac/rbacRoleMenu")
public class RbacRoleMenuController extends BaseController<RbacRoleMenuBiz, RbacRoleMenu, Long> {

    /**
     * 获取角色权限点
     * @param roleId
     * @return
     */
    @FaLogOpr("获取角色权限点")
    @RequestMapping(value = "/getRoleMenu/{roleId}", method = RequestMethod.GET)
    @ResponseBody
    public Ret<RoleMenuVo> getRoleMenu(@PathVariable Long roleId) {
        RoleMenuVo o = baseBiz.getRoleMenu(roleId);
        return ok(o);
    }

    /**
     * 更新角色权限点
     * @param roleMenuVo
     * @return
     */
    @FaLogOpr("更新角色权限点")
    @RequestMapping(value = "/updateRoleMenu", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> updateRoleMenu(@RequestBody RoleMenuVo roleMenuVo) {
        baseBiz.updateRoleMenu(roleMenuVo);
        return ok();
    }

}
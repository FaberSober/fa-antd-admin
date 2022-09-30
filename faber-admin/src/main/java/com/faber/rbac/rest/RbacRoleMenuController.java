package com.faber.rbac.rest;

import com.faber.common.vo.msg.ObjectRestResponse;
import com.faber.common.rest.BaseController;
import com.faber.rbac.biz.RbacRoleMenuBiz;
import com.faber.rbac.entity.RbacRoleMenu;
import com.faber.rbac.vo.RoleMenuVo;
import org.springframework.web.bind.annotation.*;

/**
 * BASE-角色权限对应表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@RestController
@RequestMapping("/api/rbac/rbacRoleMenu")
public class RbacRoleMenuController extends BaseController<RbacRoleMenuBiz, RbacRoleMenu, Long> {

    /**
     * 获取角色权限点
     * @param roleId
     * @return
     */
    @RequestMapping(value = "/getRoleMenu/{roleId}", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<RoleMenuVo> getRoleMenu(@PathVariable Long roleId) {
        RoleMenuVo o = baseBiz.getRoleMenu(roleId);
        return ok(o);
    }

    /**
     * 更新角色权限点
     * @param roleMenuVo
     * @return
     */
    @RequestMapping(value = "/updateRoleMenu", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Boolean> updateRoleMenu(@RequestBody RoleMenuVo roleMenuVo) {
        baseBiz.updateRoleMenu(roleMenuVo);
        return ok();
    }

}
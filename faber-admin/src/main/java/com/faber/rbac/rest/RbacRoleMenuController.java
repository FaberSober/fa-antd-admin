package com.faber.rbac.rest;

import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.rest.BaseController;
import com.faber.rbac.biz.RbacRoleMenuBiz;
import com.faber.rbac.entity.RbacRoleMenu;
import com.faber.rbac.vo.UpdateRoleMenuVo;
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
     * 更新角色权限点
     * @param updateRoleMenuVo
     * @return
     */
    @RequestMapping(value = "/updateRoleMenu", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Boolean> updateRoleMenu(@RequestBody UpdateRoleMenuVo updateRoleMenuVo) {
        baseBiz.updateRoleMenu(updateRoleMenuVo);
        return ok();
    }

}
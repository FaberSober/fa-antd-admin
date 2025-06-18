package com.faber.api.base.rbac.rest;

import com.faber.api.base.rbac.biz.RbacUserRoleBiz;
import com.faber.api.base.rbac.enums.RbacMenuScopeEnum;
import com.faber.api.base.rbac.vo.req.RbacUserRoleQueryVo;
import com.faber.api.base.rbac.entity.RbacUserRole;
import com.faber.api.base.rbac.vo.req.RbacUserRoleUpdateVo;
import com.faber.api.base.rbac.vo.req.RbacUserRolesVo;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.annotation.LogNoRet;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.query.BasePageQuery;
import com.faber.core.vo.msg.Ret;
import com.faber.core.vo.msg.TableRet;
import com.faber.core.web.rest.BaseController;
import com.faber.core.vo.tree.TreeNode;
import com.faber.api.base.rbac.entity.RbacMenu;
import com.faber.api.base.rbac.entity.RbacRole;
import com.faber.api.base.rbac.vo.RbacUserRoleRetVo;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * BASE-用户角色关联表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@FaLogBiz("用户角色")
@RestController
@RequestMapping("/api/base/rbac/rbacUserRole")
public class RbacUserRoleController extends BaseController<RbacUserRoleBiz, RbacUserRole, Long> {

    @FaLogOpr("获取账户角色")
    @RequestMapping(value = "/getUserRoles/{userId}", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<RbacRole>> getUserRoles(@PathVariable String userId) {
        List<RbacRole> o = baseBiz.getUserRoles(userId);
        return ok(o);
    }

    @FaLogOpr("登录账户角色")
    @RequestMapping(value = "/getMyRoles", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<RbacRole>> getMyRoles() {
        List<RbacRole> o = baseBiz.getUserRoles(getLoginUserId());
        return ok(o);
    }

    /**
     * 获取登录账户的菜单列表
     * @return
     */
    @FaLogOpr("登录账户菜单")
    @RequestMapping(value = "/getMyMenus", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<RbacMenu>> getMyMenus(@RequestParam(value = "scope", defaultValue = "1") Integer scope) {
        List<RbacMenu> o = baseBiz.getUserMenus(getLoginUserId(), RbacMenuScopeEnum.fromValue(scope));
        return ok(o);
    }

    @FaLogOpr("登录账户菜单树")
    @RequestMapping(value = "/getMyMenusTree", method = RequestMethod.GET)
    @ResponseBody
    @LogNoRet
    public Ret<List<TreeNode<RbacMenu>>> getMyMenusTree(@RequestParam(value = "scope", defaultValue = "1") Integer scope) {
        List<TreeNode<RbacMenu>> o = baseBiz.getUserMenusTree(getLoginUserId(), RbacMenuScopeEnum.fromValue(scope));
        return ok(o);
    }

    @FaLogOpr("分页查询")
    @RequestMapping(value = "/pageVo", method = RequestMethod.POST)
    @ResponseBody
    @LogNoRet
    public TableRet<RbacUserRoleRetVo> pageVo(@RequestBody BasePageQuery<RbacUserRoleQueryVo> query) {
        return baseBiz.pageVo(query);
    }

    @FaLogOpr(value = "添加用户角色", crud = LogCrudEnum.C)
    @RequestMapping(value = "/addUsers", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> addUsers(@RequestBody RbacUserRoleUpdateVo param) {
        baseBiz.addUsers(param);
        return ok();
    }

    @FaLogOpr(value = "更新用户角色", crud = LogCrudEnum.C)
    @RequestMapping(value = "/updateUserRoles", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> updateUserRoles(@Validated @RequestBody RbacUserRolesVo params) {
        baseBiz.updateUserRoles(params);
        return ok();
    }

}
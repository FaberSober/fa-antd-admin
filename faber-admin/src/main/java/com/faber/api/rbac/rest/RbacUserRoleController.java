package com.faber.api.rbac.rest;

import com.faber.api.rbac.entity.RbacUserRole;
import com.faber.api.rbac.vo.query.RbacUserRoleQueryVo;
import com.faber.core.annotation.LogNoRet;
import com.faber.core.vo.msg.Ret;
import com.faber.core.vo.msg.TableRet;
import com.faber.core.web.rest.BaseController;
import com.faber.core.vo.tree.TreeNode;
import com.faber.api.rbac.biz.RbacUserRoleBiz;
import com.faber.api.rbac.entity.RbacMenu;
import com.faber.api.rbac.entity.RbacRole;
import com.faber.api.rbac.vo.RbacUserRoleRetVo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * BASE-用户角色关联表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@RestController
@RequestMapping("/api/rbac/rbacUserRole")
public class RbacUserRoleController extends BaseController<RbacUserRoleBiz, RbacUserRole, Long> {

    /**
     * 获取账户的角色列表
     * @return
     */
    @RequestMapping(value = "/getUserRoles/{userId}", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<RbacRole>> getUserRoles(@PathVariable String userId) {
        List<RbacRole> o = baseBiz.getUserRoles(userId);
        return ok(o);
    }

    /**
     * 获取登录账户的角色列表
     * @return
     */
    @RequestMapping(value = "/getMyRoles", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<RbacRole>> getMyRoles() {
        List<RbacRole> o = baseBiz.getUserRoles(getCurrentUserId());
        return ok(o);
    }

    /**
     * 获取登录账户的权限列表
     * @return
     */
    @RequestMapping(value = "/getMyMenus", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<RbacMenu>> getMyMenus() {
        List<RbacMenu> o = baseBiz.getUserMenus(getCurrentUserId());
        return ok(o);
    }

    /**
     * 获取登录账户的权限列表Tree
     * @return
     */
    @RequestMapping(value = "/getMyMenusTree", method = RequestMethod.GET)
    @ResponseBody
    @LogNoRet
    public Ret<List<TreeNode<RbacMenu>>> getMyMenusTree() {
        List<TreeNode<RbacMenu>> o = baseBiz.getUserMenusTree(getCurrentUserId());
        return ok(o);
    }

    /**
     * 分页查询
     */
    @RequestMapping(value = "/pageVo", method = RequestMethod.POST)
    @ResponseBody
    @LogNoRet
    public TableRet<RbacUserRoleRetVo> pageVo(@RequestBody RbacUserRoleQueryVo query) {
        return baseBiz.pageVo(query);
    }

}
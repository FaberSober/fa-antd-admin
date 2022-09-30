package com.faber.rbac.rest;

import com.faber.common.vo.BasePageQuery;
import com.faber.common.vo.msg.ObjectRestResponse;
import com.faber.common.vo.msg.TableResultResponse;
import com.faber.common.rest.BaseController;
import com.faber.common.vo.TreeNode;
import com.faber.rbac.biz.RbacUserRoleBiz;
import com.faber.rbac.entity.RbacMenu;
import com.faber.rbac.entity.RbacRole;
import com.faber.rbac.entity.RbacUserRole;
import com.faber.rbac.vo.RbacUserRoleRetVo;
import com.faber.rbac.vo.query.RbacUserRoleQueryVo;
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
    public ObjectRestResponse<List<RbacRole>> getUserRoles(@PathVariable String userId) {
        List<RbacRole> o = baseBiz.getUserRoles(userId);
        return ok(o);
    }

    /**
     * 获取登录账户的角色列表
     * @return
     */
    @RequestMapping(value = "/getMyRoles", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<List<RbacRole>> getMyRoles() {
        List<RbacRole> o = baseBiz.getUserRoles(getCurrentUserId());
        return ok(o);
    }

    /**
     * 获取登录账户的权限列表
     * @return
     */
    @RequestMapping(value = "/getMyMenus", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<List<RbacMenu>> getMyMenus() {
        List<RbacMenu> o = baseBiz.getUserMenus(getCurrentUserId());
        return ok(o);
    }

    /**
     * 获取登录账户的权限列表Tree
     * @return
     */
    @RequestMapping(value = "/getMyMenusTree", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<List<TreeNode<RbacMenu>>> getMyMenusTree() {
        List<TreeNode<RbacMenu>> o = baseBiz.getUserMenusTree(getCurrentUserId());
        return ok(o);
    }

    /**
     * 分页查询
     */
    @RequestMapping(value = "/pageVo", method = RequestMethod.POST)
    @ResponseBody
    public TableResultResponse<RbacUserRoleRetVo> pageVo(@RequestBody RbacUserRoleQueryVo query) {
        return baseBiz.pageVo(query);
    }

}
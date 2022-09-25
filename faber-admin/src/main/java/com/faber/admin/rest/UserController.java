package com.faber.admin.rest;

import com.faber.admin.biz.PermissionBiz;
import com.faber.admin.biz.UserBiz;
import com.faber.admin.entity.User;
import com.faber.admin.vo.FrontUser;
import com.faber.admin.vo.UserAccountVo;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.rest.BaseController;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.Map;

/**
 * ${DESCRIPTION}
 */
@RestController
@RequestMapping("/api/admin/user")
public class UserController extends BaseController<UserBiz, User, String> {

    @Resource
    private PermissionBiz permissionBiz;

    /**
     * 获取登录账户信息
     */
    @RequestMapping(value = "/getLoginUser", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<User> getLoginUser() {
        User o = baseBiz.getLoginUser();
        return ok(o);
    }

    /**
     * 传入token返回用户信息
     * @return
     * @throws Exception
     */
    @Deprecated
    @RequestMapping(value = "/front/info", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<FrontUser> frontInfo() throws Exception {
        FrontUser o = permissionBiz.frontInfo();
        return ok(o);
    }

    @RequestMapping(value = "/resetPwd", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Boolean> resetPwd(@RequestBody Map<String, Object> params) {
        baseBiz.resetPwd(params);
        return ok();
    }

    /**
     * 更新个人账户基本信息
     */
    @RequestMapping(value = "/updateMine", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Boolean> updateMine(@Valid @RequestBody UserAccountVo vo) {
        baseBiz.updateMine(getCurrentUserId(), vo);
        return ok();
    }

    /**
     * 更新个人账户密码
     */
    @RequestMapping(value = "/updateMyPwd", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Boolean> updateMyPwd(@RequestBody Map<String, Object> params) {
        baseBiz.updateMyPwd(getCurrentUserId(), params);
        return ok();
    }

    /**
     * 更新账户ApiToken
     */
    @RequestMapping(value = "/updateMyApiToken", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Boolean> updateMyApiToken(@RequestBody Map<String, Object> params) {
        baseBiz.updateMyApiToken(getCurrentUserId());
        return ok();
    }

    /**
     * 管理员批量更新账户密码
     */
    @RequestMapping(value = "/accountAdminUpdatePwd", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Boolean> accountAdminUpdatePwd(@RequestBody Map<String, Object> params) {
        baseBiz.accountAdminUpdatePwd(params);
        return ok();
    }

    /**
     * 管理员批量删除账户
     */
    @RequestMapping(value = "/accountAdminDelete", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Boolean> accountAdminDelete(@RequestBody Map<String, Object> params) {
        baseBiz.accountAdminDelete(params);
        return ok();
    }

}

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
public class UserController extends BaseController<UserBiz, User> {

    @Resource
    private PermissionBiz permissionBiz;

    /**
     * 传入token返回用户信息
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/front/info", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<FrontUser> getUserInfo() throws Exception {
        FrontUser userInfo = permissionBiz.getUserInfo();
        return new ObjectRestResponse<FrontUser>().data(userInfo);
    }

    @RequestMapping(value = "/resetPwd", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Boolean> resetPwd(@RequestBody Map<String, Object> params) {
        baseBiz.resetPwd(params);
        return ok();
    }

    /**
     * 获取个人账户基本信息
     */
    @RequestMapping(value = "/account/base", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<User> accountBase() {
        User user = baseBiz.getById(getCurrentUserId());
        return ok(user);
    }

    /**
     * 更新个人账户基本信息
     */
    @RequestMapping(value = "/account/base/update", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Boolean> accountBaseUpdate(@Valid @RequestBody UserAccountVo vo) {
        baseBiz.accountBaseUpdate(getCurrentUserId(), vo);
        return ok();
    }

    /**
     * 更新个人账户密码
     */
    @RequestMapping(value = "/account/base/updatePwd", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Boolean> accountBaseUpdatePwd(@RequestBody Map<String, Object> params) {
        baseBiz.accountBaseUpdatePwd(getCurrentUserId(), params);
        return ok();
    }

    /**
     * 更新账户ApiToken
     */
    @RequestMapping(value = "/account/base/updateApiToken", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Boolean> accountBaseUpdateApiToken(@RequestBody Map<String, Object> params) {
        baseBiz.accountBaseUpdateApiToken(getCurrentUserId());
        return ok();
    }

    /**
     * 管理员批量更新账户密码
     */
    @RequestMapping(value = "/account/admin/updatePwd", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Boolean> accountAdminUpdatePwd(@RequestBody Map<String, Object> params) {
        baseBiz.accountAdminUpdatePwd(params);
        return ok();
    }

    /**
     * 管理员批量删除账户
     */
    @RequestMapping(value = "/account/admin/delete", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Boolean> accountAdminDelete(@RequestBody Map<String, Object> params) {
        baseBiz.accountAdminDelete(params);
        return ok();
    }

}

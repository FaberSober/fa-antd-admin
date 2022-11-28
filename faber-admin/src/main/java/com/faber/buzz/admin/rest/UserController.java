package com.faber.buzz.admin.rest;

import com.faber.buzz.admin.biz.UserBiz;
import com.faber.buzz.admin.entity.User;
import com.faber.buzz.admin.vo.UserAccountVo;
import com.faber.common.vo.msg.Ret;
import com.faber.common.web.rest.BaseController;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

/**
 * ${DESCRIPTION}
 */
@RestController
@RequestMapping("/api/admin/user")
public class UserController extends BaseController<UserBiz, User, String> {

    /**
     * 获取登录账户信息
     */
    @RequestMapping(value = "/getLoginUser", method = RequestMethod.GET)
    @ResponseBody
    public Ret<User> getLoginUser() {
        User o = baseBiz.getLoginUser();
        return ok(o);
    }

    @RequestMapping(value = "/resetPwd", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> resetPwd(@RequestBody Map<String, Object> params) {
        baseBiz.resetPwd(params);
        return ok();
    }

    /**
     * 更新个人账户基本信息
     */
    @RequestMapping(value = "/updateMine", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> updateMine(@Valid @RequestBody UserAccountVo vo) {
        baseBiz.updateMine(getCurrentUserId(), vo);
        return ok();
    }

    /**
     * 更新个人账户密码
     */
    @RequestMapping(value = "/updateMyPwd", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> updateMyPwd(@RequestBody Map<String, Object> params) {
        baseBiz.updateMyPwd(getCurrentUserId(), params);
        return ok();
    }

    /**
     * 更新账户ApiToken
     */
    @RequestMapping(value = "/updateMyApiToken", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> updateMyApiToken(@RequestBody Map<String, Object> params) {
        baseBiz.updateMyApiToken(getCurrentUserId());
        return ok();
    }

    /**
     * 管理员批量更新账户密码
     */
    @RequestMapping(value = "/accountAdminUpdatePwd", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> accountAdminUpdatePwd(@RequestBody Map<String, Object> params) {
        baseBiz.accountAdminUpdatePwd(params);
        return ok();
    }

    /**
     * 管理员批量删除账户
     */
    @RequestMapping(value = "/accountAdminDelete", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> accountAdminDelete(@RequestBody Map<String, Object> params) {
        baseBiz.accountAdminDelete(params);
        return ok();
    }

}

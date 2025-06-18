package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.UserBiz;
import com.faber.api.base.admin.entity.User;
import com.faber.api.base.admin.vo.query.*;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.config.annotation.AdminOpr;
import com.faber.core.config.annotation.ApiToken;
import com.faber.core.config.annotation.IgnoreUserToken;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;

@FaLogBiz("用户")
@RestController
@RequestMapping("/api/base/admin/user")
public class UserController extends BaseController<UserBiz, User, String> {

    @FaLogOpr("登录账户信息")
    @RequestMapping(value = "/getLoginUser", method = RequestMethod.GET)
    @ResponseBody
    public Ret<User> getLoginUser() {
        User o = baseBiz.getLoginUser();
        return ok(o);
    }

    @FaLogOpr("获取API账户信息")
    @RequestMapping(value = "/getApiUser", method = RequestMethod.GET)
    @ResponseBody
    @ApiToken
    public Ret<User> getApiUser() {
        User o = baseBiz.getLoginUser();
        return ok(o);
    }

    @FaLogOpr(value = "重置密码", crud = LogCrudEnum.C)
    @RequestMapping(value = "/resetPwd", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> resetPwd(@RequestBody Map<String, Object> params) {
        baseBiz.resetPwd(params);
        return ok();
    }

    @FaLogOpr(value = "更新个人信息", crud = LogCrudEnum.C)
    @RequestMapping(value = "/updateMine", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> updateMine(@Valid @RequestBody UserAccountVo vo) {
        baseBiz.updateMine(getLoginUserId(), vo);
        return ok();
    }

    @FaLogOpr(value = "更新个人密码", crud = LogCrudEnum.C)
    @RequestMapping(value = "/updateMyPwd", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> updateMyPwd(@RequestBody Map<String, Object> params) {
        baseBiz.updateMyPwd(getLoginUserId(), params);
        return ok();
    }

    @FaLogOpr(value = "更新个人ApiToken", crud = LogCrudEnum.C)
    @RequestMapping(value = "/updateMyApiToken", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> updateMyApiToken() {
        baseBiz.updateMyApiToken(getLoginUserId());
        return ok();
    }

    @FaLogOpr(value = "批量更新部门", crud = LogCrudEnum.C)
    @RequestMapping(value = "/updateBatchDept", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> updateBatchDept(@RequestBody UserBatchUpdateDeptVo params) {
        baseBiz.updateBatchDept(params);
        return ok();
    }

    @FaLogOpr(value = "批量更新角色", crud = LogCrudEnum.C)
    @RequestMapping(value = "/updateBatchRole", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> updateBatchRole(@RequestBody UserBatchUpdateRoleVo params) {
        baseBiz.updateBatchRole(params);
        return ok();
    }

    @FaLogOpr(value = "批量更新密码", crud = LogCrudEnum.C)
    @RequestMapping(value = "/updateBatchPwd", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> updateBatchPwd(@RequestBody UserBatchUpdatePwdVo params) {
        baseBiz.updateBatchPwd(params);
        return ok();
    }

    @FaLogOpr(value = "批量删除账户", crud = LogCrudEnum.C)
    @RequestMapping(value = "/accountAdminDelete", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> accountAdminDelete(@RequestBody Map<String, Object> params) {
        baseBiz.accountAdminDelete(params);
        return ok();
    }

    @FaLogOpr(value = "不鉴权计数", crud = LogCrudEnum.R)
    @RequestMapping(value = "/jumpCount", method = RequestMethod.POST)
    @ResponseBody
    @IgnoreUserToken
    public Ret<Long> jumpCount(@RequestBody UserJumpCountVo query) {
        long count = baseBiz.jumpCount(query);
        return ok(count);
    }

    @FaLogOpr(value = "注册", crud = LogCrudEnum.R)
    @RequestMapping(value = "/registry", method = RequestMethod.POST)
    @ResponseBody
    @AdminOpr
    public Ret<Boolean> registry(@Validated @RequestBody UserRegistryVo params) {
        baseBiz.registry(params);
        return ok();
    }

    @FaLogOpr(value = "重置密码", crud = LogCrudEnum.R)
    @RequestMapping(value = "/forgetResetPwd", method = RequestMethod.POST)
    @ResponseBody
    @AdminOpr
    public Ret<Boolean> forgetResetPwd(@Validated @RequestBody UserForgetResetPwdVo params) {
        baseBiz.forgetResetPwd(params);
        return ok();
    }

    @FaLogOpr(value = "更新", crud = LogCrudEnum.U)
    @RequestMapping(value = "/updateSimpleById", method = RequestMethod.POST)
    @ResponseBody
    public Ret<User> updateSimpleById(@RequestBody User entity) {
        baseBiz.updateSimpleById(entity);
        return ok();
    }

}

package com.faber.api.base.admin.rest;

import cn.dev33.satoken.stp.SaTokenInfo;
import com.faber.api.base.admin.biz.AuthBiz;
import com.faber.config.utils.user.LoginReqVo;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.config.annotation.IgnoreUserToken;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.service.LogoutService;
import com.faber.core.utils.BaseResHandler;
import com.faber.core.vo.msg.Ret;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;

@FaLogBiz("鉴权")
@RestController
@RequestMapping("/api/base/admin/auth")
public class AuthController extends BaseResHandler {

    @Resource
    private AuthBiz authBiz;

    @Resource
    private LogoutService logoutService;

    @FaLogOpr(value = "登录", crud = LogCrudEnum.C)
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @IgnoreUserToken
    public Ret<SaTokenInfo> login(@RequestBody LoginReqVo loginReqVo) {
        SaTokenInfo token = authBiz.login(loginReqVo);
        return ok(token);
    }

    @FaLogOpr(value = "登出", crud = LogCrudEnum.C)
    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public Ret<String> logout() {
        String url = authBiz.logout();
        return ok(url);
    }

}

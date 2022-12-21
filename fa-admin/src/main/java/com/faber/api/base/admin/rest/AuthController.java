package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.AuthBiz;
import com.faber.config.utils.user.AuthRequest;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.config.annotation.IgnoreUserToken;
import com.faber.core.utils.BaseResHandler;
import com.faber.core.vo.msg.Ret;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@FaLogBiz("鉴权")
@RestController
@RequestMapping("/api/base/auth")
@Slf4j
public class AuthController extends BaseResHandler {

    @Resource
    private AuthBiz authBiz;

    @FaLogOpr("登录")
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @IgnoreUserToken
    public Ret<String> login(@RequestBody AuthRequest authRequest) throws Exception {
        String token = authBiz.login(authRequest);
        return ok(token);
    }

}

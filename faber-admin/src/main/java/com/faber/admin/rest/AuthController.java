package com.faber.admin.rest;

import com.faber.admin.biz.AuthBiz;
import com.faber.common.config.annotation.IgnoreUserToken;
import com.faber.common.utils.user.AuthRequest;
import com.faber.common.vo.msg.ObjectRestResponse;
import com.faber.common.utils.BaseResHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController extends BaseResHandler {

    @Autowired
    private AuthBiz authBiz;

    @RequestMapping(value = "/jwt/token", method = RequestMethod.POST)
    @IgnoreUserToken
    public ObjectRestResponse<String> createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {
        String token = authBiz.login(authRequest);
        return ok(token);
    }

}

package com.faber.admin.rest;

import com.faber.admin.util.user.JwtAuthenticationRequest;
import com.faber.admin.biz.AuthBiz;
import com.faber.admin.config.annotation.IgnoreUserToken;
import com.faber.common.msg.ObjectRestResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    @Value("${jwt.token-header}")
    private String tokenHeader;

    @Autowired
    private AuthBiz authBiz;

    @RequestMapping(value = "/jwt/token", method = RequestMethod.POST)
    @IgnoreUserToken
    public ObjectRestResponse<String> createAuthenticationToken(@RequestBody JwtAuthenticationRequest authenticationRequest) throws Exception {
        log.info(authenticationRequest.getUsername() + " require logging...");
        final String token = authBiz.login(authenticationRequest);
        return new ObjectRestResponse<String>().data(token);
    }

}

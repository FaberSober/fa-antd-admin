package com.faber.admin.biz;

import com.faber.admin.entity.User;
import com.faber.admin.util.jwt.JWTInfo;
import com.faber.admin.util.user.JwtAuthenticationRequest;
import com.faber.admin.util.user.JwtTokenUtil;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class AuthBiz {

    @Resource
    private JwtTokenUtil jwtTokenUtil;

    @Resource
    private UserBiz userBiz;

    public String login(JwtAuthenticationRequest authenticationRequest) throws Exception {
        User user = userBiz.validate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
        return jwtTokenUtil.generateToken(new JWTInfo(user.getUsername(), user.getId(), user.getName()));
    }


}

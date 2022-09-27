package com.faber.admin.biz;

import com.faber.admin.entity.LogLogin;
import com.faber.admin.entity.User;
import com.faber.admin.util.jwt.JWTInfo;
import com.faber.admin.util.user.JwtAuthenticationRequest;
import com.faber.admin.util.user.JwtTokenUtil;
import com.faber.common.context.BaseContextHandler;
import com.faber.common.util.IpUtils;
import com.faber.common.util.RequestUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class AuthBiz {

    @Resource
    private JwtTokenUtil jwtTokenUtil;

    @Resource
    private UserBiz userBiz;

    @Resource
    private LogLoginBiz logLoginBiz;

    public String login(JwtAuthenticationRequest authenticationRequest) throws Exception {
        User user = userBiz.validate(authenticationRequest.getUsername(), authenticationRequest.getPassword());

        // 将用户放入上下文
        BaseContextHandler.setUserId(user.getId());
        BaseContextHandler.setName(user.getName());
        BaseContextHandler.setUsername(user.getUsername());
        BaseContextHandler.setLogin(true);

        // 记录登录日志
        LogLogin logLogin = new LogLogin();

        logLogin.setAgent(RequestUtils.getAgent());

        // 获取IP地址
        IpUtils.IpAddr ipAddr = IpUtils.getIpAddrByApi(BaseContextHandler.getIp());
        logLogin.setPro(ipAddr.getPro());
        logLogin.setCity(ipAddr.getCity());
        logLogin.setAddr(ipAddr.getAddr());

        logLoginBiz.save(logLogin);


        return jwtTokenUtil.generateToken(new JWTInfo(user.getUsername(), user.getId(), user.getName()));
    }


}

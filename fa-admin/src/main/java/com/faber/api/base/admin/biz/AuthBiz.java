package com.faber.api.base.admin.biz;

import cn.hutool.http.useragent.UserAgent;
import cn.hutool.http.useragent.UserAgentUtil;
import com.faber.api.base.admin.entity.LogLogin;
import com.faber.api.base.admin.entity.User;
import com.faber.config.utils.jwt.JWTInfo;
import com.faber.config.utils.user.AuthRequest;
import com.faber.config.utils.user.JwtTokenUtil;
import com.faber.core.context.BaseContextHandler;
import com.faber.core.utils.IpUtils;
import com.faber.core.utils.RequestUtils;
import com.faber.core.vo.utils.IpAddr;
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

    /**
     * web登录，返回token
     * @param authRequest
     * @return
     * @throws Exception
     */
    public String login(AuthRequest authRequest) throws Exception {
        User user = userBiz.validate(authRequest.getUsername(), authRequest.getPassword());

        // 将用户放入上下文
        BaseContextHandler.setUserId(user.getId());
        BaseContextHandler.setName(user.getName());
        BaseContextHandler.setUsername(user.getUsername());
        BaseContextHandler.setLogin(true);

        // 记录登录日志
        LogLogin logLogin = new LogLogin();

        logLogin.setAgent(RequestUtils.getAgent());

        // 解析agent字符串
        UserAgent ua = UserAgentUtil.parse(logLogin.getAgent());
        logLogin.setOs(ua.getOs().toString());
        logLogin.setBrowser(ua.getBrowser().toString());
        logLogin.setVersion(ua.getVersion());
        logLogin.setMobile(ua.isMobile());

        // 获取IP地址
        IpAddr ipAddr = IpUtils.getIpAddrByApi(BaseContextHandler.getIp());
        logLogin.setPro(ipAddr.getPro());
        logLogin.setCity(ipAddr.getCity());
        logLogin.setAddr(ipAddr.getAddr());

        logLoginBiz.save(logLogin);

        return jwtTokenUtil.createToken(new JWTInfo(user.getId(), "web"));
    }


}

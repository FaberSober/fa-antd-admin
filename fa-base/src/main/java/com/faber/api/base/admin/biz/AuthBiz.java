package com.faber.api.base.admin.biz;

import cn.dev33.satoken.stp.SaTokenInfo;
import cn.dev33.satoken.stp.StpUtil;
import cn.hutool.http.useragent.UserAgent;
import cn.hutool.http.useragent.UserAgentUtil;
//import com.alicp.jetcache.Cache;
//import com.alicp.jetcache.CacheManager;
//import com.alicp.jetcache.anno.CacheType;
//import com.alicp.jetcache.template.QuickConfig;
import com.faber.api.base.admin.entity.LogLogin;
import com.faber.api.base.admin.entity.User;
import com.faber.config.utils.user.LoginReqVo;
import com.faber.core.context.BaseContextHandler;
import com.faber.core.service.LogoutService;
import com.faber.core.utils.IpUtils;
import com.faber.core.utils.RequestUtils;
import com.faber.core.vo.utils.IpAddr;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;

@Service
public class AuthBiz implements LogoutService {

    @Resource
    private UserBiz userBiz;

    @Resource
    private LogLoginBiz logLoginBiz;

//    @Autowired
//    private CacheManager cacheManager;
//
//    /** 记录用户登录来源 */
//    private Cache<String, String> userTokenFromCache;

    @PostConstruct
    public void init() {
//        QuickConfig qc = QuickConfig.newBuilder("oauthCache:")
////                .expire(Duration.ofSeconds(-1))
//                .cacheType(CacheType.BOTH) // two level cache
////                .localLimit(50)
//                .syncLocal(true) // invalidate local cache in all jvm process after update
//                .build();
//        userTokenFromCache = cacheManager.getOrCreateCache(qc);
    }

    /**
     * web登录，返回token
     * @param loginReqVo
     * @return
     * @throws Exception
     */
    public SaTokenInfo login(LoginReqVo loginReqVo) {
        User user = userBiz.validate(loginReqVo.getUsername(), loginReqVo.getPassword());
        return login(user, "web");
    }

    /**
     * 登录，返回登录成功token
     * @param user 登录用户
     * @param source 登录来源：web/app
     * @return
     */
    public SaTokenInfo login(User user, String source) {
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
        if (ipAddr != null) {
            logLogin.setPro(ipAddr.getPro());
            logLogin.setCity(ipAddr.getCity());
            logLogin.setAddr(ipAddr.getAddr());
        }

        logLoginBiz.save(logLogin);

        // 使用sa-token登录框架
        StpUtil.login(user.getId(), source);
        SaTokenInfo tokenInfo = StpUtil.getTokenInfo();
        return tokenInfo;
    }

    @Override
    public String logout() {
        StpUtil.logout();
        return LogoutService.super.logout();
    }

}

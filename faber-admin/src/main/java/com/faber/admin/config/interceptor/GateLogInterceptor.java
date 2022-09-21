package com.faber.admin.config.interceptor;

import com.faber.admin.biz.GateLogBiz;
import com.faber.admin.entity.GateLog;
import com.faber.admin.util.jwt.IJWTInfo;
import com.faber.common.util.IpUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 请求URL日志拦截
 */
@Slf4j
public class GateLogInterceptor extends AbstractInterceptor {

    @Autowired
    private GateLogBiz gateLogBiz;

    private final ThreadLocal<GateLog> gateLogThreadLocal = new ThreadLocal<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        GateLog log = new GateLog();

        // request basic information
        log.setUrl(request.getRequestURI());
        log.setMethod(request.getMethod());
        log.setAgent(request.getHeader("User-Agent"));

        log.setCrtHost(IpUtils.getRequestIp(request));

        gateLogThreadLocal.set(log);

        return super.preHandle(request, response, handler);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // write log
        GateLog log = gateLogThreadLocal.get();
        if (log != null) {
            log.setRetStatus(response.getStatus());

            // 获取IP地址
            IpUtils.IpAddr ipAddr = IpUtils.getIpAddrByApi(log.getCrtHost());
            log.setPro(ipAddr.getPro());
            log.setCity(ipAddr.getCity());
            log.setAddr(ipAddr.getAddr());

            gateLogBiz.save(log);

            gateLogThreadLocal.remove();
        }

        super.afterCompletion(request, response, handler, ex);
    }
}

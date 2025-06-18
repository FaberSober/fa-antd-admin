package com.faber.config.interceptor;

import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.context.BaseContextHandler;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.utils.IpUtils;
import lombok.extern.slf4j.Slf4j;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * 第一个空请求拦截，存储一些请求基本信息
 *
 * @author xu.pengfei
 * @date 2022/11/28 11:32
 */
@Slf4j
public class FirstEmptyInterceptor extends AbstractInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // mark log info
        FaLogBiz faLogBiz = super.getMethodAnno(handler, FaLogBiz.class);
        FaLogOpr faLogOpr = super.getMethodAnno(handler, FaLogOpr.class);

        request.setAttribute("FaLogBiz", faLogBiz != null ? faLogBiz.value() : "");
        request.setAttribute("FaLogOpr", faLogOpr != null ? faLogOpr.value() : "");
        request.setAttribute("FaLogCrud", faLogOpr != null ? faLogOpr.crud() : LogCrudEnum.R);

        // 记录request ip
        BaseContextHandler.setUserIp(IpUtils.getRequestIp(request));

        return super.preHandle(request, response, handler);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // 服务器名称
        response.setHeader("Server", "fa-server");
        // 是否可以在iframe显示视图： DENY=不可以 | SAMEORIGIN=同域下可以 | ALLOW-FROM uri=指定域名下可以
        response.setHeader("X-Frame-Options", "SAMEORIGIN");
        // 是否启用浏览器默认XSS防护： 0=禁用 | 1=启用 | 1; mode=block 启用, 并在检查到XSS攻击时，停止渲染页面
        response.setHeader("X-XSS-Protection", "1; mode=block");
        // 禁用浏览器内容嗅探
        response.setHeader("X-Content-Type-Options", "nosniff");
        super.afterCompletion(request, response, handler, ex);
    }
}

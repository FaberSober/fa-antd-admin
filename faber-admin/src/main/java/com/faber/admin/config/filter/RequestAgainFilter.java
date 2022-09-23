package com.faber.admin.config.filter;

import com.faber.admin.biz.GateLogBiz;
import com.faber.admin.config.filter.wrapper.BodyHttpServletRequestWrapper;
import com.faber.admin.config.filter.wrapper.BodyHttpServletResponseWrapper;
import com.faber.admin.entity.GateLog;
import com.faber.common.context.BaseContextHandler;
import com.faber.common.util.IpUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * 请求重复读取日志记录Filter
 * 1. 包装request，使得请求内容可以多次读取；
 * 2. 包装response，可以读取返回内容；
 * 3. 记录请求日志；
 * 4. 销毁上下文中记录的登录用户信息；
 */
@WebFilter(filterName = "RequestAgainFilter", urlPatterns = "/api/*")
public class RequestAgainFilter implements Filter {

    /**
     * 列表的api不记录日志
     */
    private static final List<String> NO_LOG_APIS = Arrays.asList("/api/admin/gateLog/page");

    @Autowired
    private GateLogBiz gateLogBiz;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        long startTime = System.currentTimeMillis();

        BodyHttpServletRequestWrapper requestWrapper = new BodyHttpServletRequestWrapper((HttpServletRequest) servletRequest);
        BodyHttpServletResponseWrapper responseWrapper = new BodyHttpServletResponseWrapper((HttpServletResponse) servletResponse);

        // 交给下一个过滤器或servlet处理
        filterChain.doFilter(requestWrapper, responseWrapper);

        byte[] content = responseWrapper.getContent();
        //获取response的值
        String responseData = IOUtils.toString(content, "UTF-8");

        //注意 此处是servletResponse 不是responseWrapper,写responseWrapper的话 依旧响应不了
        ServletOutputStream outputStream = servletResponse.getOutputStream();
        outputStream.write(content);
        outputStream.flush();
        outputStream.close();

        if (!NO_LOG_APIS.contains(requestWrapper.getRequestURI())) {
            String logNoRet = responseWrapper.getHeader("LogNoRet");
            GateLog log = new GateLog();

            // request basic information
            log.setUrl(requestWrapper.getRequestURI());
            log.setMethod(requestWrapper.getMethod());
            log.setAgent(requestWrapper.getHeader("User-Agent"));

            log.setCrtHost(IpUtils.getRequestIp(requestWrapper));
            log.setRequest(requestWrapper.getBody());
            log.setReqSize(log.getRequest().length());

            log.setResponse("1".equals(logNoRet) ? "" : responseData);
            log.setRetSize(responseData.length());

            log.setDuration(System.currentTimeMillis() - startTime);
            log.setRetStatus(responseWrapper.getStatus());

            // 获取IP地址
            IpUtils.IpAddr ipAddr = IpUtils.getIpAddrByApi(log.getCrtHost());
            log.setPro(ipAddr.getPro());
            log.setCity(ipAddr.getCity());
            log.setAddr(ipAddr.getAddr());

            gateLogBiz.save(log);
        }

        BaseContextHandler.remove(); // 销毁上下文中记录的登录用户信息
    }

    /**
     * 过滤器销毁
     * explain:在容器中销毁当前过滤器的时候自动调用
     */
    @Override
    public void destroy() {
        System.out.println("销毁过滤器!");
    }
}

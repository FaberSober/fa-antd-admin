package com.faber.config.filter;

import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.SecureUtil;
import cn.hutool.extra.servlet.ServletUtil;
import cn.hutool.http.useragent.UserAgent;
import cn.hutool.http.useragent.UserAgentUtil;
import cn.hutool.json.JSONUtil;
import com.faber.api.base.admin.biz.ConfigSysBiz;
import com.faber.api.base.admin.biz.LogApiBiz;
import com.faber.api.base.admin.entity.LogApi;
import com.faber.core.config.filter.wrapper.BodyHttpServletRequestWrapper;
import com.faber.core.config.filter.wrapper.BodyHttpServletResponseWrapper;
import com.faber.core.constant.CommonConstants;
import com.faber.core.constant.FaSetting;
import com.faber.core.context.BaseContextHandler;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.exception.BuzzException;
import com.faber.core.utils.FaServletUtil;
import com.faber.core.utils.IpUtils;
import com.faber.core.vo.config.FaConfig;
import com.faber.core.vo.utils.IpAddr;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.connector.RequestFacade;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

/**
 * 请求重复读取日志记录Filter
 * 1. 包装request，使得请求内容可以多次读取；
 * 2. 包装response，可以读取返回内容；
 * 3. 记录请求日志；
 * 4. 销毁上下文中记录的登录用户信息；
 *
 * @author xu.pengfei
 * @date 2022/11/28 11:39
 */
@Slf4j
@WebFilter(filterName = "RequestAgainFilter", urlPatterns = "/api/*", asyncSupported = true)
public class RequestAgainFilter implements Filter {

    /**
     * 列表的api不记录日志
     * TODO 这里要支持写入配置文件中
     */
    private static final List<String> NO_LOG_APIS = Arrays.asList("/api/admin/logApi/page", "/api/admin/logLogin/page", "/api/admin/dict/getSystemConfig");
    private static final List<String> WEBSOCKET_APIS = Arrays.asList("/api/websocket/base");
    private static final Set<String> SKIP_URLS = new HashSet<>();

    public static void addSkipUrl(String url) {
        SKIP_URLS.add(url);
    }

    @Resource LogApiBiz logApiBiz;
    @Resource FaSetting faSetting;
    @Resource ConfigSysBiz configSysBiz;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        long startTime = System.currentTimeMillis();

        // 判断是否是跳过判断的URL
        String uri = servletRequest.getServletContext().getContextPath() + ((HttpServletRequest) servletRequest).getRequestURI();
        boolean isSkipUrl = SKIP_URLS.contains(uri);
        // 判断是否是websocket请求
        boolean isWebSocket = "websocket".equalsIgnoreCase(((RequestFacade) servletRequest).getHeader("upgrade"));
        for (String api : WEBSOCKET_APIS) {
            try {
                if (uri.contains(api)) {
                    isWebSocket = true;
                }
            } catch (Exception e) {}
        }
        if (isSkipUrl || isWebSocket) {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        String logSaveLevel = configSysBiz.getConfig().getLogSaveLevel();
        if ("no".equalsIgnoreCase(logSaveLevel)) { // no log save
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        BodyHttpServletRequestWrapper requestWrapper = new BodyHttpServletRequestWrapper((HttpServletRequest) servletRequest);
        BodyHttpServletResponseWrapper responseWrapper = new BodyHttpServletResponseWrapper((HttpServletResponse) servletResponse);

        // request basic information
        int timestamp = requestWrapper.getIntHeader("timestamp");
        String url = requestWrapper.getRequestURI();
        if (StrUtil.isNotEmpty(requestWrapper.getQueryString())) {
            url += "?" + requestWrapper.getQueryString();
        }
        String urlFrom = requestWrapper.getHeader(CommonConstants.FA_FROM);
        if (faSetting.getSafety().isIntact()) {
            String sigSecret = faSetting.getSafety().getSecret();
            if ("web".equalsIgnoreCase(urlFrom)) {
                // 这里还可以根据签名做请求重放验证
                // url验证
                {
                    String urlSig = SecureUtil.md5(url + "@@" + timestamp + "@@" + sigSecret);
                    String clientUrlSig = requestWrapper.getHeader("us");
                    if (!urlSig.equalsIgnoreCase(clientUrlSig)) {
                        throw new BuzzException("请求不完整，请确认");
                    }
                }

                // body验证
                {
                    String body = requestWrapper.getBody();
                    if (StrUtil.isEmpty(body)) {
                        body = "{}";
                    }
                    String bodySig = SecureUtil.md5(body + "@@" + timestamp + "@@" + sigSecret);
                    String clientBodySig = requestWrapper.getHeader("bs");
                    if (!clientBodySig.equalsIgnoreCase(bodySig)) {
                        throw new BuzzException("请求体不完整，请确认");
                    }
                }
            }
        }

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

        if (NO_LOG_APIS.contains(requestWrapper.getRequestURI())) {
            BaseContextHandler.remove(); // 销毁上下文中记录的登录用户信息
            return;
        }

        String faNoLog = responseWrapper.getHeader("FaNoLog");
        if ("1".equals(faNoLog)) {
            BaseContextHandler.remove(); // 销毁上下文中记录的登录用户信息
            return;
        }

        String logNoRet = responseWrapper.getHeader("LogNoRet");
        LogApi logApi = new LogApi();

        logApi.setBiz(StrUtil.toString(requestWrapper.getAttribute("FaLogBiz")));
        logApi.setOpr(StrUtil.toString(requestWrapper.getAttribute("FaLogOpr")));
        logApi.setOprRemark(BaseContextHandler.getLogOprRemark());
        logApi.setCrud((LogCrudEnum) requestWrapper.getAttribute("FaLogCrud"));

        logApi.setUrl(url);
        logApi.setMethod(requestWrapper.getMethod());
        logApi.setAgent(requestWrapper.getHeader("User-Agent"));

        // 解析agent字符串
        UserAgent ua = UserAgentUtil.parse(logApi.getAgent());
        logApi.setOs(ua.getOs().toString());
        logApi.setBrowser(ua.getBrowser().toString());
        logApi.setVersion(ua.getVersion());
        logApi.setMobile(ua.isMobile() ? true : false);

        // 自定义Header信息
        logApi.setFaFrom(urlFrom);
        try {
            if (StrUtil.isNotEmpty(requestWrapper.getHeader(CommonConstants.FA_VERSION_CODE))) {
                logApi.setVersionCode(Long.parseLong(requestWrapper.getHeader(CommonConstants.FA_VERSION_CODE)));
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
        logApi.setVersionName(requestWrapper.getHeader(CommonConstants.FA_VERSION_NAME));

        // 获取完整Header信息
        try {
            Map<String, String> headerMap = FaServletUtil.getHeaderMap((HttpServletRequest) servletRequest);
            logApi.setHeaders(JSONUtil.parseObj(headerMap).toString());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        logApi.setCrtHost(IpUtils.getRequestIp(requestWrapper));
        logApi.setRequest(requestWrapper.getBody());
        logApi.setReqSize(logApi.getRequest().length());

        logApi.setRetStatus(responseWrapper.getStatus());

        if ("1".equals(logNoRet) && !"200".equals(logApi.getRetStatus())) {
            logApi.setResponse("");
        } else {
            logApi.setResponse(responseData);
        }

        if ("simple".equalsIgnoreCase(logSaveLevel)) { // don't save log request and response content
            logApi.setRequest("");
            logApi.setResponse("");
        }

        logApi.setRetSize(responseData.length());

        logApi.setDuration(System.currentTimeMillis() - startTime);

        // 获取IP地址
        IpAddr ipAddr = IpUtils.getIpAddrByApi(logApi.getCrtHost());
        if (ipAddr != null) {
            logApi.setPro(ipAddr.getPro());
            logApi.setCity(ipAddr.getCity());
            logApi.setAddr(ipAddr.getAddr());
        }

        // 取备注
        logApi.setRemark(BaseContextHandler.getLogRemark());

        logApiBiz.save(logApi);

        BaseContextHandler.remove(); // 销毁上下文中记录的登录用户信息
    }

    /**
     * 过滤器销毁
     * explain:在容器中销毁当前过滤器的时候自动调用
     */
    @Override
    public void destroy() {
        log.debug("销毁过滤器!");
    }
}

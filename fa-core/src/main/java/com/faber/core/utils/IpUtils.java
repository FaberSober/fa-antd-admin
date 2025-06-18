package com.faber.core.utils;


import cn.hutool.cache.CacheUtil;
import cn.hutool.cache.impl.TimedCache;
import cn.hutool.extra.spring.SpringUtil;
import com.faber.core.constant.FaSetting;
import com.faber.core.service.IpService;
import com.faber.core.vo.utils.IpAddr;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;

import jakarta.servlet.http.HttpServletRequest;
import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * Ip帮助类
 * @author xu.pengfei
 * @date 2022/11/28 14:27
 */
@Slf4j
public class IpUtils {

    /**
     * 是否初始化
     */
    private static boolean init = false;

    /**
     * 是否离线。若是，则无法获取IP地址。
     */
    private static boolean offline = false;

    private static TimedCache<String, IpAddr> ipAddrTimedCache = CacheUtil.newTimedCache(24 * 60 * 60 * 1000);

    /**
     * 获取HttpServletRequest访问ip
     *
     * @param request
     * @return
     */
    public static String getRequestIp(HttpServletRequest request) {
        String ipAddress = null;
        try {
            ipAddress = request.getHeader("x-forwarded-for");
            if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
                ipAddress = request.getHeader("Proxy-Client-IP");
            }
            if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
                ipAddress = request.getHeader("WL-Proxy-Client-IP");
            }
            if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
                ipAddress = request.getRemoteAddr();
                if (ipAddress.equals("127.0.0.1")) {
                    // 根据网卡取本机配置的IP
                    InetAddress inet = null;
                    try {
                        inet = InetAddress.getLocalHost();
                    } catch (UnknownHostException e) {
                        e.printStackTrace();
                    }
                    ipAddress = inet.getHostAddress();
                }
            }
            // 对于通过多个代理的情况，第一个IP为客户端真实IP,多个IP按照','分割
            if (ipAddress != null && ipAddress.length() > 15) { // "***.***.***.***".length()
                // = 15
                if (ipAddress.indexOf(",") > 0) {
                    ipAddress = ipAddress.substring(0, ipAddress.indexOf(","));
                }
            }
        } catch (Exception e) {
            ipAddress = "";
        }
        // ipAddress = this.getRequest().getRemoteAddr();

        return ipAddress;
    }

    /**
     * 根据IP获取IP地址。
     * 缓存获取机制：每个IP接口请求返回缓存一天
     * @param ip
     * @return
     */
    public static IpAddr getIpAddrByApi(String ip) {
        try {
            if (!init) {
                FaSetting faSetting = SpringUtil.getBean(FaSetting.class);
                offline = faSetting.getConfig().getOffline();
                init = true;
            }

            if (!offline) {
                if (ipAddrTimedCache.containsKey(ip)) {
                    return ipAddrTimedCache.get(ip);
                }
                IpService ipService = SpringUtil.getBean(IpService.class);
                IpAddr ipAddr = ipService.ipJson(ip); // TODO 这个接口地址无法访问了
                ipAddrTimedCache.put(ip, ipAddr);
                return ipAddr;
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
        return null;
    }

}

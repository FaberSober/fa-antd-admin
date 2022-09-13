package com.faber.common.util;


import cn.hutool.cache.CacheUtil;
import cn.hutool.cache.impl.TimedCache;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.java.Log;

import javax.servlet.http.HttpServletRequest;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.List;

@Log
public class IpUtils {

    private static final List<String> LOCAL_IP = ListUtil.toList("127.0.0.1", "localhost");
    private static final String API_IP_ADDR = "https://whois.pconline.com.cn/ipJson.jsp?ip=%1$s&json=true";

    private static final TimedCache<String, IpAddr> IP_ADDR_CACHE = CacheUtil.newTimedCache(24 * 60 * 60 * 1000);

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
        if (StrUtil.isEmpty(ip)) return new IpAddr(ip, "", "", "");
        if (LOCAL_IP.contains(ip)) {
            return new IpAddr(ip, "本地", "本地", "本地");
        }

        if (IP_ADDR_CACHE.get(ip) != null) {
            return IP_ADDR_CACHE.get(ip);
        }

        // api get ip addr
        String ret = HttpUtil.get(String.format(API_IP_ADDR, ip));
        JSONObject retJson = JSONUtil.parseObj(ret);
        IpAddr ipAddr = new IpAddr(ip, retJson.getStr("pro"), retJson.getStr("city"), retJson.getStr("addr"));

        IP_ADDR_CACHE.put(ip, ipAddr);
        return ipAddr;
    }

    @Data
    @ToString
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IpAddr {
        private String ip;
        private String pro;
        private String city;
        private String addr;
    }

}

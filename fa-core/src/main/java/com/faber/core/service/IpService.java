package com.faber.core.service;

//import com.alicp.jetcache.anno.Cached;
import com.dtflys.forest.annotation.Get;
import com.faber.core.vo.utils.IpAddr;

/**
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/16 10:09
 */
public interface IpService {

//    @Cached(name="ipAddr:", key="#ip", expire = 24 * 60 * 60)
    @Get("https://whois.pconline.com.cn/ipJson.jsp?ip={0}&json=true")
    String ipJsonApi(String ip);

    default IpAddr ipJson(String ip) {
        String json = ipJsonApi(ip);
        return com.alibaba.fastjson2.JSON.parseObject(json, IpAddr.class);
    }

}

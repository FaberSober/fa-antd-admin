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
    IpAddr ipJson(String ip);

}

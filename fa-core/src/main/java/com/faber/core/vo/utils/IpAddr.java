package com.faber.core.vo.utils;

import lombok.Data;
import lombok.ToString;

import java.io.Serializable;

/**
 * https://whois.pconline.com.cn/ipJson.jsp?ip={0}&json=true
 * 返回的IP地址对象
 * {regionCode=0, regionNames=, proCode=999999, err=noprovince, city=, cityCode=0, ip=127.0.0.1, pro=, region=, addr= 本机地址}
 * {regionCode=0, regionNames=, proCode=320000, err=, city=南京市, cityCode=320100, ip=180.110.160.161, pro=江苏省, region=, addr=江苏省南京市 电信}
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/16 10:45
 */
@Data
@ToString
public class IpAddr implements Serializable {

    private String regionCode;
    private String regionNames;
    private String proCode;
    private String err;
    private String city;
    private String cityCode;
    private String ip;
    private String pro;
    private String region;
    private String addr;

}

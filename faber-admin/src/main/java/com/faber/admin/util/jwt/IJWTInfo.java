package com.faber.admin.util.jwt;

/**
 * 获取JWT信息通用接口
 */
public interface IJWTInfo {

    /** 获取用户名 */
    String getUniqueName();

    /** 获取用户ID */
    String getId();

    /** 获取名称 */
    String getName();
}

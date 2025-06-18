package com.faber.core.service;

/**
 * 退出登录接口，其他系统实现接口以此实现自定义的退出登录逻辑
 *
 * @author xupengfei
 * @description
 * @date 2022/11/28 10:56
 */
public interface LogoutService {

    /**
     * 退出登录
     * @return 返回跳转的URL
     */
    default String logout() {
        return "/login";
    }

}

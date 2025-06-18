package com.faber.core.utils;

import cn.dev33.satoken.util.SaResult;
import com.faber.core.context.BaseContextHandler;
import com.faber.core.context.TnTenantContextHandler;
import com.faber.core.vo.msg.Ret;

/**
 * 通用返回共有接口
 *
 * @author xu.pengfei
 * @date 2022/11/28 14:28
 */
public class BaseResHandler {

    /**
     * 获取当前登录的账户ID
     * @return
     */
    public String getLoginUserId() {
        return BaseContextHandler.getUserId();
    }

    public String getLoginUserName() {
        return BaseContextHandler.getUsername();
    }

    /**
     * 获取当前登录的tenant账户
     * @return
     */
    public Long getCurrTenantUserId() {
        return TnTenantContextHandler.getUserId();
    }

    /**
     * 获取当前登录的账户ID
     * @return
     */
    public String getCurrentUserId() {
        return BaseContextHandler.getUserId();
    }

    protected <T> Ret<T> ok() {
        return Ret.ok();
    }

    protected <T> Ret<T> ok(T data) {
        SaResult.ok();
        return Ret.data(data);
    }

}

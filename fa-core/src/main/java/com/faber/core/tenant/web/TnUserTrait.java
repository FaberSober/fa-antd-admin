package com.faber.core.tenant.web;

import com.faber.core.context.TnTenantContextHandler;

/**
 * @author Farando
 * @date 2023/3/23 15:16
 * @description
 */
public interface TnUserTrait {

    /**
     * 获取登录账户的userId
     * @return
     */
    default Long getUserId() {
        return TnTenantContextHandler.getUserId();
    }

    /**
     * 获取登录账户的tenantId
     * @return
     */
    default Long getTenantId() {
        return TnTenantContextHandler.getTenantId();
    }

    /**
     * 获取登录账户上下文选中的corpId
     * @return
     */
    default Long getCorpId() {
        return TnTenantContextHandler.getCorpId();
    }

}

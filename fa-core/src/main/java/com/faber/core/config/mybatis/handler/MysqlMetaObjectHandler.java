package com.faber.core.config.mybatis.handler;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import com.faber.core.bean.BaseCrtEntity;
import com.faber.core.bean.BaseUpdEntity;
import com.faber.core.context.BaseContextHandler;
import com.faber.core.context.TnTenantContextHandler;
import com.faber.core.tenant.bean.TnBaseCrtEntity;
import com.faber.core.tenant.bean.TnBaseUpdEntity;
import org.apache.ibatis.reflection.MetaObject;

import java.time.LocalDateTime;

/**
 * 测试，自定义元对象字段填充控制器，实现公共字段自动写入
 */
public class MysqlMetaObjectHandler implements MetaObjectHandler {

    /**
     * 测试 user 表 name 字段为空自动填充
     */
    @Override
    public void insertFill(MetaObject metaObject) {
//        Object crtTime = this.getFieldValByName("crtTime", metaObject);
        // tenant
        if (TnTenantContextHandler.getLogin()) {
            this.strictInsertFill(metaObject, "crtUser", String.class, TnTenantContextHandler.getUserId() + "");
            this.strictInsertFill(metaObject, "crtName", String.class, TnTenantContextHandler.getName());

            this.strictInsertFill(metaObject, "tenantId", Long.class, TnTenantContextHandler.getTenantId());
            this.strictInsertFill(metaObject, "corpId", Long.class, TnTenantContextHandler.getCorpId());

            // 冗余记录租户、企业名称
            this.strictInsertFill(metaObject, "tenantName", String.class, TnTenantContextHandler.getTenantName());
            this.strictInsertFill(metaObject, "corpName", String.class, TnTenantContextHandler.getCorpName());
        }

        // admin
        if (BaseContextHandler.getLogin()) {
            this.strictInsertFill(metaObject, "crtUser", String.class, BaseContextHandler.getUserId());
            this.strictInsertFill(metaObject, "crtName", String.class, BaseContextHandler.getName());
        }

        this.strictInsertFill(metaObject, "crtTime", LocalDateTime.class, LocalDateTime.now());
        this.strictInsertFill(metaObject, "crtHost", String.class, BaseContextHandler.getIp());

        this.strictInsertFill(metaObject, "deleted", Boolean.class, false);
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        // tenant login
        if (TnTenantContextHandler.getLogin()) {
            this.strictInsertFill(metaObject, "updUser", String.class, TnTenantContextHandler.getUserId() + "");
            this.strictInsertFill(metaObject, "updName", String.class, TnTenantContextHandler.getName());
        }

        // admin login
        if (BaseContextHandler.getLogin()) {
            this.strictUpdateFill(metaObject, "updUser", String.class, BaseContextHandler.getUserId());
            this.strictUpdateFill(metaObject, "updName", String.class, BaseContextHandler.getName());
        }

        this.strictUpdateFill(metaObject, "updTime", LocalDateTime.class, LocalDateTime.now());
        this.strictUpdateFill(metaObject, "updHost", String.class, BaseContextHandler.getIp());
    }

}


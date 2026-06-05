package com.faber.core.config.mybatis.handler;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import com.faber.core.context.BaseContextHandler;
import org.apache.ibatis.reflection.MetaObject;

import java.util.Date;

/**
 * 测试，自定义元对象字段填充控制器，实现公共字段自动写入
 */
public class MysqlMetaObjectHandler implements MetaObjectHandler {

    /**
     * 测试 user 表 name 字段为空自动填充
     */
    @Override
    public void insertFill(MetaObject metaObject) {
        // admin login
        if (BaseContextHandler.getLogin()) {
            this.strictInsertFill(metaObject, "crtUser", String.class, BaseContextHandler.getUserId());
            this.strictInsertFill(metaObject, "crtName", String.class, BaseContextHandler.getName());
        }

        // multi tenant
        if (metaObject.hasSetter("tenantId") && BaseContextHandler.getTenantId() != null) {
            this.strictInsertFill(metaObject, "tenantId", String.class, BaseContextHandler.getTenantId());
        }

        // 使用 Date 类型
        this.strictInsertFill(metaObject, "crtTime", Date.class, new Date());
        this.strictInsertFill(metaObject, "crtHost", String.class, BaseContextHandler.getIp());

        this.strictInsertFill(metaObject, "deleted", Boolean.class, false);
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        // admin login
        if (BaseContextHandler.getLogin()) {
            this.strictUpdateFill(metaObject, "updUser", String.class, BaseContextHandler.getUserId());
            this.strictUpdateFill(metaObject, "updName", String.class, BaseContextHandler.getName());
        }

        // 使用 Date 类型
        this.strictUpdateFill(metaObject, "updTime", Date.class, new Date());
        this.strictUpdateFill(metaObject, "updHost", String.class, BaseContextHandler.getIp());
    }

}

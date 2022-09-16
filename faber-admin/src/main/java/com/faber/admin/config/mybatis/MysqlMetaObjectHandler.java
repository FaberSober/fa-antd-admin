package com.faber.admin.config.mybatis;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import com.faber.common.enums.DelStateEnum;
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
        System.out.println("*************************");
        System.out.println("insert of mysql fill");
        System.out.println("*************************");

        // insert crtTime
//        Object crtTime = this.getFieldValByName("crtTime", metaObject);
        this.strictInsertFill(metaObject, "crtTime", LocalDateTime.class, LocalDateTime.now());
        this.strictInsertFill(metaObject, "crtUser", String.class, "1");
        this.strictInsertFill(metaObject, "crtName", String.class, "admin");
        this.strictInsertFill(metaObject, "crtHost", String.class, "127.0.0.1");

        this.strictInsertFill(metaObject, "delState", DelStateEnum.class, DelStateEnum.VALID);
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        System.out.println("*************************");
        System.out.println("update of mysql fill");
        System.out.println("*************************");

        this.strictUpdateFill(metaObject, "updTime", LocalDateTime.class, LocalDateTime.now());
        this.strictUpdateFill(metaObject, "updUser", String.class, "1");
        this.strictUpdateFill(metaObject, "updName", String.class, "admin");
        this.strictUpdateFill(metaObject, "updHost", String.class, "127.0.0.1");
    }

}


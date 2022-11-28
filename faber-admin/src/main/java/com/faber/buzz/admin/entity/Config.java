package com.faber.buzz.admin.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.bean.BaseDelEntity;
import com.faber.core.enums.BoolEnum;
import lombok.Data;
import lombok.ToString;


/**
 * 系统-配置表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-02 21:21:45
 */
@TableName("base_config")
@Data
@ToString
public class Config extends BaseDelEntity {

    @TableId(type = IdType.AUTO)
    private Integer id;

    /** 业务模块 */
    private String buzzModal;

    public static final class Type {
        /**
         * 表格字段配置
         */
        public static final String TABLE_COLUMNS = "TABLE_COLUMNS";
        /**
         * 查询条件
         */
        public static final String QUERY_CONDITION = "QUERY_CONDITION";
    }

    /** 配置类型 */
    private String type;

    /** 配置名称 */
    private String name;

    /** 配置JSON */
    private String data;

    /** 是否系统 */
    private BoolEnum system;

    /** 是否默认 */
    private BoolEnum defaultScene;

    /** 是否隐藏 */
    private BoolEnum hide;

    /** 排序 */
    private Integer sort;

}

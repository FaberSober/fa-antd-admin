package com.faber.api.base.admin.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.faber.core.annotation.FaModalName;
import com.faber.core.bean.BaseDelEntity;
import com.faber.core.vo.query.Condition;
import com.faber.core.vo.query.ConditionGroup;
import lombok.Data;
import lombok.ToString;


/**
 * 配置-查询场景
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-02 21:21:45
 */
@Data
@ToString
@FaModalName(name = "配置-查询场景")
@TableName(value = "base_config_scene", autoResultMap = true)
public class ConfigScene extends BaseDelEntity {

    @TableId(type = IdType.AUTO)
    private Integer id;

    /** 业务模块 */
    private String biz;

    /** 配置类型 */
    private String type;

    /** 配置名称 */
    private String name;

    /** 配置JSON */
    @TableField(typeHandler = JacksonTypeHandler.class)
    private ConditionGroup[] data;

    /** 是否系统 */
    private Boolean system = false;

    /** 是否默认 */
    private Boolean defaultScene = false;

    /** 是否隐藏 */
    private Boolean hide;

    /** 排序 */
    private Integer sort;

}

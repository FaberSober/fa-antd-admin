package com.faber.api.base.admin.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;
import lombok.ToString;

import java.util.Map;


/**
 * BASE-配置-通用
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-02 21:21:45
 */
@Data
@ToString
@FaModalName(name = "配置-通用")
@TableName(value = "base_config", autoResultMap = true)
public class Config extends BaseDelEntity {

    @TableId(type = IdType.AUTO)
    private Integer id;

    /** 业务模块 */
    @SqlEquals
    private String biz;

    /** 配置类型(给前段使用，后端不注重的类型) */
    @SqlEquals
    private String type;

    /** 配置JSON */
    @TableField(typeHandler = JacksonTypeHandler.class)
    private Object data;

}

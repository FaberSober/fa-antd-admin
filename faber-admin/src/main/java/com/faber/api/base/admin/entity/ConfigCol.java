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
 * BASE-配置-表格字段
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-02 21:21:45
 */
@Data
@ToString
@FaModalName(name = "配置-查询场景")
@TableName(value = "base_config_col", autoResultMap = true)
public class ConfigCol extends BaseDelEntity {

    @TableId(type = IdType.AUTO)
    private Integer id;

    /** 业务模块 */
    @SqlEquals
    private String biz;

    /** 配置JSON */
    @TableField(typeHandler = JacksonTypeHandler.class)
    private Map<String, Object>[] data;

}

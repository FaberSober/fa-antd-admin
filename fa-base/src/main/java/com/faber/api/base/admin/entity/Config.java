package com.faber.api.base.admin.entity;

import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.bean.BaseDelEntity;
import com.faber.core.config.mybatis.handler.UniversalJsonTypeHandler;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;


/**
 * BASE-配置-通用
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-02 21:21:45
 */
@Data
@ToString
@EqualsAndHashCode(callSuper=false)
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
    @TableField(typeHandler = UniversalJsonTypeHandler.class)
    private List<Map<String, Object>> data;

}

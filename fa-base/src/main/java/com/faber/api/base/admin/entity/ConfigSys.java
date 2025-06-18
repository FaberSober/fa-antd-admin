package com.faber.api.base.admin.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.faber.core.enums.ConfigSysSafePasswordTypeEnum;
import com.faber.core.annotation.FaModalName;
import com.faber.core.bean.BaseDelEntity;
import com.faber.core.vo.config.FaConfig;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


/**
 * BASE-配置-系统配置
 * @author xu.pengfei
 * @email faberxu@gmail.com
 * @date 2022/12/12 10:07
 */
@Data
@ToString
@FaModalName(name = "配置-系统配置")
@TableName(value = "base_config_sys", autoResultMap = true)
public class ConfigSys extends BaseDelEntity {

    @TableId(type = IdType.AUTO)
    private Integer id;

    /** 配置JSON */
    @TableField(typeHandler = JacksonTypeHandler.class)
    private FaConfig data;

}

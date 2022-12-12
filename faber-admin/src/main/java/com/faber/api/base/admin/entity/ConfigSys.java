package com.faber.api.base.admin.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.bean.BaseDelEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Map;


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
    private Config data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Config {
        /**
         * 网站标题
         */
        private String title;
        /**
         * 网站副标题
         */
        private String subTitle;
        /**
         * 版权信息
         */
        private String cop;
        /**
         * 网站logo
         */
        private String logo;
        /**
         * 网站带文字logo
         */
        private String logoWithText;
        /**
         * [官网]地址
         */
        private String portalLink;
    }

}

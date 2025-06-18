package com.faber.api.base.admin.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.api.base.admin.enums.AreaLevelEnum;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.annotation.SqlSearch;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;


/**
 * 中国行政地区表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-21 09:55:39
 */
@TableName("base_area")
@Data
public class Area implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Integer id;

    @NotNull
    private AreaLevelEnum level;

    /** 父级行政代 */
    @NotNull
    @SqlEquals
    private Long parentCode;

    /** 行政代码 */
    @NotNull
    @SqlEquals
    private Long areaCode;

    /** 邮政编码 */
    @SqlEquals
    private Integer zipCode;

    /** 区号 */
    @SqlEquals
    private String cityCode;

    /** 名称 */
    @SqlSearch
    @NotBlank
    private String name;

    /** 简称 */
    @NotBlank
    private String shortName;

    /** 组合名 */
    @SqlSearch
    @NotBlank
    private String mergerName;

    /** 拼音 */
    @NotBlank
    private String pinyin;

    /** 经度 */
    @NotNull
    private BigDecimal lng;

    /** 纬度 */
    @NotNull
    private BigDecimal lat;

}

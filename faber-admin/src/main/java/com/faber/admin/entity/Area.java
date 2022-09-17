package com.faber.admin.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.common.annotation.SqlEquals;
import com.faber.common.annotation.SqlSearch;
import com.faber.common.constant.DictConstants;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
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

    /**
     * 层级{@link DictConstants.AreaLevel}
     */
    @NotNull
    @SqlEquals
    // @Column(name = "level")
    private Integer level;

    //父级行政代
    @NotNull
    @SqlEquals
    // @Column(name = "parent_code")
    private Long parentCode;

    //行政代码
    @NotNull
    @SqlEquals
    // @Column(name = "area_code")
    private Long areaCode;

    //邮政编码
    @SqlEquals
    // @Column(name = "zip_code")
    private Integer zipCode;

    //区号
    @SqlEquals
    // @Column(name = "city_code")
    private String cityCode;

    //名称
    @SqlSearch
    @NotBlank
    // @Column(name = "name")
    private String name;

    //简称
    @NotBlank
    // @Column(name = "short_name")
    private String shortName;

    //组合名
    @SqlSearch
    @NotBlank
    // @Column(name = "merger_name")
    private String mergerName;

    //拼音
    @NotBlank
    // @Column(name = "pinyin")
    private String pinyin;

    //经度
    @NotNull
    // @Column(name = "lng")
    private BigDecimal lng;

    //纬度
    @NotNull
    // @Column(name = "lat")
    private BigDecimal lat;

    @ToString
    @AllArgsConstructor
    public enum Level {
        NATION(-1, "国家"),
        PROVINCE(0, "省"),
        CITY(1, "市"),
        COUNTY(2, "区县"),
        COUNTRY(3, "乡"),
        VILLAGE(4, "村");

        public final int value;
        public final String text;
    }

}

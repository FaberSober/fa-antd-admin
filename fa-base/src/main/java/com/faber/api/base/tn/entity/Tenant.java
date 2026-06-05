package com.faber.api.base.tn.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.annotation.SqlSearch;
import com.faber.core.bean.BaseDelEntity;
import com.faber.core.config.validator.validator.Vg;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import java.util.Date;

/**
 * 租户表
 */
@Data
@FaModalName(name = "租户")
@TableName("tn_tenant")
public class Tenant extends BaseDelEntity {

    @Null(groups = Vg.Crud.C.class)
    @NotNull(groups = Vg.Crud.U.class)
    @TableId(type = IdType.ASSIGN_UUID)
    @SqlEquals
    private String id;

    @NotBlank
    @SqlSearch
    @ExcelProperty("租户编码")
    private String code;

    @NotBlank
    @SqlSearch
    @ExcelProperty("租户名称")
    private String name;

    @ExcelProperty("租户简称")
    private String shortName;

    @NotNull
    @SqlEquals
    @ExcelProperty("状态")
    private Boolean status;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @ExcelProperty("到期时间")
    private Date expireTime;

    @SqlSearch
    @ExcelProperty("联系人")
    private String contactName;

    @SqlSearch
    @ExcelProperty("联系电话")
    private String contactPhone;

    @ExcelProperty("联系邮箱")
    private String contactEmail;

    @ExcelProperty("排序")
    private Integer sort;

    @ExcelProperty("描述")
    private String description;

}

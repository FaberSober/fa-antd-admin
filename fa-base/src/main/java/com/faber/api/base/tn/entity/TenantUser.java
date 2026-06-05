package com.faber.api.base.tn.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.bean.BaseDelEntity;
import com.faber.core.config.validator.validator.Vg;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;

/**
 * 租户用户关联表
 */
@Data
@FaModalName(name = "租户用户关联")
@TableName("tn_tenant_user")
public class TenantUser extends BaseDelEntity {

    @Null(groups = Vg.Crud.C.class)
    @NotNull(groups = Vg.Crud.U.class)
    @TableId(type = IdType.ASSIGN_UUID)
    @SqlEquals
    private String id;

    @NotBlank
    @SqlEquals
    @ExcelProperty("租户ID")
    private String tenantId;

    @NotBlank
    @SqlEquals
    @ExcelProperty("用户ID")
    private String userId;

    @NotNull
    @SqlEquals
    @ExcelProperty("是否租户管理员")
    private Boolean isAdmin;

    @NotNull
    @SqlEquals
    @ExcelProperty("状态")
    private Boolean status;

    @ExcelProperty("排序")
    private Integer sort;

    @ExcelProperty("描述")
    private String description;

    @TableField(exist = false)
    @ExcelProperty("租户名称")
    private String tenantName;

    @TableField(exist = false)
    @ExcelProperty("用户名称")
    private String userName;

}

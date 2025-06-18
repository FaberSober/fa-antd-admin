package com.faber.api.base.admin.entity;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.api.base.admin.enums.UserWorkStatusEnum;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.annotation.SqlSearch;
import com.faber.core.bean.BaseDelEntity;
import com.faber.core.enums.SexEnum;
import com.faber.core.config.validator.validator.TelNoValidator;
import com.faber.core.config.validator.validator.Vg;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@FaModalName(name = "账户")
@Data
@TableName("base_user")
public class User extends BaseDelEntity {

    @Null(groups = Vg.Crud.C.class)
    @NotNull(groups = Vg.Crud.U.class)
    @ColumnWidth(7)
    @TableId(type = IdType.ASSIGN_UUID)
    @SqlEquals
    private String id;

    @NotNull
    @SqlEquals
    @ExcelIgnore
    private String departmentId;

    @NotNull
    @SqlSearch
    @ExcelProperty("用户名")
    private String username;

    @NotNull(groups = Vg.Crud.C.class)
    @ExcelIgnore
    private String password;

    @NotNull
    @SqlSearch
    @ExcelProperty("姓名")
    private String name;

    @ExcelProperty("生日")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date birthday;

    @ExcelProperty("联系地址")
    private String address;

    @NotNull
    @TelNoValidator
    @SqlSearch
    @ExcelProperty("手机号")
    private String tel;

    @Email
    @SqlSearch
    @ExcelProperty("邮箱")
    private String email;

    @SqlEquals
    @ExcelProperty("性别")
    private SexEnum sex;

    @NotNull
    @SqlEquals
    @ExcelProperty("账户有效")
    private Boolean status;

    @ExcelProperty("角色名称")
    private String roleNames;

    @ExcelProperty("备注")
    private String description;

    @ExcelProperty("头像")
    private String img;

    @ExcelIgnore
    @ExcelProperty("api token")
    private String apiToken;

    @ExcelProperty("开放平台的唯一标识符")
    private String wxUnionId;

    @ExcelProperty("微信小程序用户唯一标识")
    private String wxMaOpenid;

    /**
     * 新增、编辑时，关联的角色ID
     */
    @ExcelIgnore
    @TableField(exist = false)
    private List<Long> roleIds;

    @ExcelProperty("部门")
    @TableField(exist = false)
    private String departmentName;

    @ExcelProperty("工作状态")
    private UserWorkStatusEnum workStatus;

    @ExcelProperty("最后在线时间")
    private Date lastOnlineTime;

    public void setRoleId(Long roleId) {
        if (this.roleIds == null) this.roleIds = new ArrayList<>();
        this.roleIds.add(roleId);
    }

}

package com.faber.api.base.admin.entity;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.annotation.SqlSearch;
import com.faber.core.bean.BaseDelEntity;
import com.faber.api.base.admin.enums.SexEnum;
import com.faber.core.config.validator.validator.TelNoValidator;
import com.faber.core.config.validator.validator.Vg;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
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

    /**
     * 新增、编辑时，关联的角色ID
     */
    @ExcelIgnore
    @TableField(exist = false)
    private List<Long> roleIds;

    @ExcelProperty("部门")
    @TableField(exist = false)
    private String departmentName;

}

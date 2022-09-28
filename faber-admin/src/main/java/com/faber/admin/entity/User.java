package com.faber.admin.entity;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.common.annotation.FaberModalName;
import com.faber.common.annotation.SqlEquals;
import com.faber.common.annotation.SqlSearch;
import com.faber.common.bean.BaseDelEntity;
import com.faber.common.enums.BoolEnum;
import com.faber.common.enums.SexEnum;
import com.faber.common.validator.TelNoValidator;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;

import java.util.Date;
import java.util.List;

@FaberModalName(name = "账户")
@Data
@TableName("base_user")
public class User extends BaseDelEntity {

    @TableId(type = IdType.ASSIGN_UUID)
    @SqlEquals
    private String id;

    @SqlEquals
    @ExcelIgnore
    private String departmentId;

    @SqlSearch
    @ExcelProperty("用户名")
    private String username;

    @ExcelIgnore
    private String password;

    @SqlSearch
    @ExcelProperty("姓名")
    private String name;

    @ExcelProperty("生日")
    private Date birthday;

    @ExcelProperty("联系地址")
    private String address;

    @TelNoValidator
    @ExcelProperty("手机号")
    @SqlSearch
    private String tel;

    @SqlSearch
    @ExcelProperty("邮箱")
    private String email;

    @SqlEquals
    @ExcelIgnore
    private SexEnum sex;

    @SqlEquals
    @ExcelIgnore
    private BoolEnum status;

    @ExcelProperty("角色名称")
    private String roleNames;

    @ExcelProperty("备注")
    private String description;

    @ExcelIgnore
    private String img;

    @ExcelIgnore
    @ExcelProperty("api token")
    private String apiToken;

    @ToString
    @AllArgsConstructor
    public enum Status {
        VALID("1", "有效"),
        FROZEN("2", "冻结");

        public final String value;
        public final String text;

    }

    /**
     * 新增、编辑时，关联的角色ID
     */
    @ExcelIgnore
    @TableField(exist = false)
    private List<Long> roleIds;

}

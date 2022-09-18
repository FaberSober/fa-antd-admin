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
import com.faber.common.validator.TelNoValidator;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;

import java.util.List;

@FaberModalName(name = "账户")
@Data
@TableName("base_user")
public class User extends BaseDelEntity {

    @TableId(type = IdType.ASSIGN_UUID)
    @SqlEquals
    private String id;

    // 部门ID
    @SqlEquals
    @ExcelIgnore
    // @Column(name = "department_id")
    private String departmentId;

    @SqlSearch
    @ExcelProperty("用户名")
    // @Column(name = "username")
    private String username;

    @ExcelIgnore
    // @Column(name = "password")
    private String password;

    @SqlSearch
    @ExcelProperty("姓名")
    // @Column(name = "name")
    private String name;

    @ExcelProperty("生日")
    // @Column(name = "birthday")
    private String birthday;

    @ExcelProperty("联系地址")
    private String address;

    @TelNoValidator
    @ExcelProperty("手机号")
    @SqlSearch
    // @Column(name = "mobile_phone")
    private String mobilePhone;

    @ExcelIgnore
    @Deprecated
    @TelNoValidator
    // @Column(name = "tel_phone")
    private String telPhone;

    @SqlSearch
    @ExcelProperty("邮箱")
    // @Column(name = "email")
    private String email;

    @SqlEquals
    @ExcelIgnore
    // @Column(name = "sex")
    private String sex;

    @SqlEquals
    @ExcelIgnore
    // @Column(name = "type")
    private String type;

    @SqlEquals
    @ExcelIgnore
    // @Column(name = "status")
    private String status;

    @ExcelProperty("备注")
    // @Column(name = "description")
    private String description;

    @ExcelIgnore
    // @Column(name = "img")
    private String img;

    @ExcelIgnore
    @ExcelProperty("api token")
    // @Column(name = "api_token")
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
    private List<Integer> groupIds;

}

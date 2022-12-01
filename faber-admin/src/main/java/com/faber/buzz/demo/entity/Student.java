package com.faber.buzz.demo.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.buzz.admin.enums.SexEnum;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;

import java.util.Date;


/**
 * Demo-学生表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-02 17:14:45
 */
@FaModalName(name = "学生")
@TableName("demo_student")
@Data
public class Student extends BaseDelEntity {

    @TableId(type = IdType.AUTO)
    private String id;

    @ExcelProperty("学生名")
    private String name;

    @ExcelProperty("年龄")
    private Integer age;

    @SqlEquals
    @ExcelProperty("性别")
    private SexEnum sex;

    @ExcelProperty("邮箱")
    private String email;

    @ExcelProperty("生日")
    private Date birthday;

    @SqlEquals
    @ExcelProperty("账户是否有效")
    private Boolean valid;

    @SqlEquals
    @ExcelProperty("补充信息ID")
    private Integer infoId;

    @SqlEquals
    @ExcelProperty("租户ID")
    private Integer tenantId;

}

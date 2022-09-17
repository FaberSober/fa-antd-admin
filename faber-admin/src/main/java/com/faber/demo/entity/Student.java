package com.faber.demo.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.common.annotation.FaberModalName;
import com.faber.common.bean.BaseDelEntity;
import lombok.Data;

import java.util.Date;


/**
 * Demo-学生表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-02 17:14:45
 */
@FaberModalName(name = "学生")
@TableName("demo_student")
@Data
public class Student extends BaseDelEntity {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private String id;

    @ExcelProperty("学生名")
    // @Column(name = "name")
    private String name;

    @ExcelProperty("年龄")
    // @Column(name = "age")
    private Integer age;

    @ExcelProperty("性别")
    // @Column(name = "sex")
    private String sex;

    @ExcelProperty("邮箱")
    // @Column(name = "email")
    private String email;

    @ExcelProperty("生日")
    // @Column(name = "birthday")
    private Date birthday;

}

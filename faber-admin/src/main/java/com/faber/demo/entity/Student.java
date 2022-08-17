package com.faber.demo.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.common.annotation.FaberModalName;
import com.faber.common.annotation.SqlEquals;
import com.faber.common.annotation.SqlSearch;
import com.faber.common.bean.BaseDelEntity;
import lombok.Data;
import tk.mybatis.mapper.annotation.KeySql;
import tk.mybatis.mapper.code.ORDER;

import javax.persistence.*;
import java.util.Date;


/**
 * Demo-学生表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-02 17:14:45
 */
@FaberModalName(name = "学生")
@Table(name = "demo_student")
@Data
public class Student extends BaseDelEntity {
    private static final long serialVersionUID = 1L;

    //
    @Id
    @KeySql(sql = "select uuid()", order = ORDER.BEFORE) // 使用UUID作为主键
    private String id;

    // 学生名
    @ExcelProperty("学生名")
    @SqlSearch
    @Column(name = "name")
    private String name;

    // 年龄
    @ExcelProperty("年龄")
    @Column(name = "age")
    private Integer age;

    // 性别
    @ExcelProperty("性别")
    @SqlEquals
    @Column(name = "sex")
    private String sex;

    // 邮箱
    @ExcelProperty("邮箱")
    @SqlSearch
    @Column(name = "email")
    private String email;

    // 生日
    @ExcelProperty("生日")
    @Column(name = "birthday")
    private Date birthday;

}

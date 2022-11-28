package com.faber.buzz.demo.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.common.annotation.FaModalName;
import lombok.Data;

import java.io.Serializable;


/**
 * Demo-学生表-扩充信息表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-02 17:14:45
 */
@FaModalName(name = "学生-扩充信息表")
@TableName("demo_student_info")
@Data
public class StudentInfo implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private String id;

    @ExcelProperty("学生ID")
    // @Column(name = "student_id")
    private Integer studentId;

    @ExcelProperty("补充信息1")
    // @Column(name = "info1")
    private String info1;

    @ExcelProperty("补充信息2")
    // @Column(name = "info2")
    private String info2;

}

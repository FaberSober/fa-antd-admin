package com.faber.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.common.annotation.FaberModalName;
import com.faber.common.annotation.SqlEquals;
import com.faber.common.annotation.SqlSearch;
import com.faber.common.bean.BaseDelEntity;
import lombok.Data;
import tk.mybatis.mapper.annotation.KeySql;
import tk.mybatis.mapper.code.ORDER;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;


/**
 * Demo-学生表-扩充信息表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-02 17:14:45
 */
@FaberModalName(name = "学生-扩充信息表")
@Table(name = "demo_student_info")
@Data
public class StudentInfo implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private String id;

    @ExcelProperty("学生ID")
    @Column(name = "student_id")
    private Integer studentId;

    @ExcelProperty("补充信息1")
    @Column(name = "info1")
    private String info1;

    @ExcelProperty("补充信息2")
    @Column(name = "info2")
    private String info2;

}

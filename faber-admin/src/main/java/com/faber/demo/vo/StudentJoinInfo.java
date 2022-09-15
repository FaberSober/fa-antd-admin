package com.faber.demo.vo;

import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.demo.entity.Student;
import lombok.Data;
import lombok.ToString;

import javax.persistence.Column;

@Data
@ToString
public class StudentJoinInfo extends Student {

    @ExcelProperty("补充信息1")
    @Column(name = "info1")
    private String info1;

    @ExcelProperty("补充信息2")
    @Column(name = "info2")
    private String info2;

}

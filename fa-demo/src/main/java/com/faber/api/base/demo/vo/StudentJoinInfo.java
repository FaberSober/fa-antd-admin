package com.faber.api.base.demo.vo;

import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.api.base.demo.entity.Student;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class StudentJoinInfo extends Student {

    @ExcelProperty("补充信息1")
    private String info1;

    @ExcelProperty("补充信息2")
    private String info2;

}

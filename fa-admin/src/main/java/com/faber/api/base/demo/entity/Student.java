package com.faber.api.base.demo.entity;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.faber.api.base.admin.enums.SexEnum;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.bean.BaseDelEntity;
import com.faber.core.config.easyexcel.type.FaJsonObj;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;


/**
 * Demo-学生表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-02 17:14:45
 */
@Data
@FaModalName(name = "学生")
@TableName(value = "demo_student", autoResultMap = true)
public class Student extends BaseDelEntity {

    @ColumnWidth(10)
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
    @ExcelProperty("企业ID")
    private Integer corpId;

    @SqlEquals
    @ExcelProperty("租户ID")
    private Integer tenantId;

    @TableField(typeHandler = JacksonTypeHandler.class)
    @ExcelProperty("标签")
    private Tag[] tags;

    @TableField(typeHandler = JacksonTypeHandler.class)
    @ExcelProperty("详细信息")
    private Info info;

    @ExcelIgnore
    @TableField(value = "tags -> '$[*].name'",
            insertStrategy = FieldStrategy.NEVER,
            updateStrategy = FieldStrategy.NEVER,
            exist = false,
            select = false)
    private String tagNames;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Tag implements Serializable, FaJsonObj {
        private String name;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Info implements Serializable, FaJsonObj {
        private String info1;
        private String info2;
    }

}

package com.faber.api.demo.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.faber.api.admin.enums.SexEnum;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.bean.BaseDelEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


/**
 * Demo-学生表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-02 17:14:45
 */
@FaModalName(name = "学生")
@TableName(value = "demo_student", autoResultMap = true)
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

    @TableField(typeHandler = JacksonTypeHandler.class)
    @ExcelProperty("标签")
    private List<Tag> tags;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Tag implements Serializable {
        private String name;
    }

    public void addTag(Tag tag) {
        if (this.tags == null) {
            this.tags = new ArrayList<>();
        }
        this.tags.add(tag);
    }

}

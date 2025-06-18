package com.faber.api.base.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.annotation.SqlTreeId;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;


/**
 * 短信验证码
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-19 10:09:36
 */
@TableName("base_sms_code")
@Data
public class SmsCode implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    @SqlTreeId
    private Integer id;

    @SqlEquals
    @ExcelProperty("手机号")
    private String phone;

    @SqlEquals
    @ExcelProperty("短信验证码")
    private String code;

    @ExcelProperty("创建时间")
    private Date crtTime;

}

package com.faber.admin.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.faber.common.annotation.SqlEquals;
import com.faber.common.annotation.SqlTreeId;
import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;


/**
 * 短信验证码
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-19 10:09:36
 */
@Table(name = "base_sms_code")
@Data
public class SmsCode implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    @SqlTreeId
    private Integer id;

    // 手机号
    @SqlEquals
    @Column(name = "phone")
    private String phone;

    // 短信验证码
    @SqlEquals
    @Column(name = "code")
    private String code;

    // 创建时间
    @Column(name = "crt_time")
    private Date crtTime;


}

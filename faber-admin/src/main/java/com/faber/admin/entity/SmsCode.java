package com.faber.admin.entity;

import com.faber.common.annotation.SqlEquals;
import com.faber.common.annotation.SqlTreeId;
import com.faber.common.bean.BaseOprEntity;
import lombok.Data;
import tk.mybatis.mapper.annotation.KeySql;
import tk.mybatis.mapper.code.ORDER;

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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

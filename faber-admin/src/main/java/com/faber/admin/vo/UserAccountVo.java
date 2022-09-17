package com.faber.admin.vo;

import com.faber.common.validator.TelNoValidator;
import lombok.Data;

import javax.persistence.Column;

@Data
public class UserAccountVo {

    private String username;

    private String name;

    private String birthday;

    private String address;

    @TelNoValidator
    // @Column(name = "mobile_phone")
    private String mobilePhone;

    private String email;

    private String sex;

    private String description;

    private String img;

}

package com.faber.buzz.admin.vo;

import com.faber.core.validator.TelNoValidator;
import lombok.Data;

@Data
public class UserAccountVo {

    private String username;

    private String name;

    private String birthday;

    private String address;

    @TelNoValidator
    private String tel;

    private String email;

    private String sex;

    private String description;

    private String img;

}

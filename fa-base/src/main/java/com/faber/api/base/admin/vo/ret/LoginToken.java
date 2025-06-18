package com.faber.api.base.admin.vo.ret;

import lombok.Data;

import java.io.Serializable;

@Data
public class LoginToken implements Serializable {

    private String token;
    private String refreshToken;

}

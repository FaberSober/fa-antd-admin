package com.faber.api.base.admin.vo.query;

import lombok.Data;

import java.io.Serializable;

@Data
public class UserJumpCountVo implements Serializable {

    private String username;
    private String tel;

}

package com.faber.admin.vo;

import lombok.Data;

import java.io.Serializable;

/**
 * ${DESCRIPTION}
 */
@Data
public class UserInfo implements Serializable {

    public String id;
    public String username;
//    public String password;
    public String name;
    private String description;
    private String img;
    private String departmentId;
    private String mobilePhone;

}

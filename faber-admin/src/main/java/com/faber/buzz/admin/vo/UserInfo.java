package com.faber.buzz.admin.vo;

import lombok.Data;

import java.io.Serializable;

/**
 * ${DESCRIPTION}
 */
@Data
public class UserInfo implements Serializable {

    private String id;
    private String departmentId;
    private String username;
    private String name;
    private String description;
    private String img;
    private String tel;

}

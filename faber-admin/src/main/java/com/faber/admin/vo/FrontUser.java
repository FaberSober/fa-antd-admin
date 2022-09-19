package com.faber.admin.vo;

import lombok.Data;

import java.util.List;

/**
 * 前端用户实体
 */
@Data
public class FrontUser {

    public String id;
    public String username;
    public String name;
    private String description;
    private String img;
    private String departmentId;

    private List<PermissionInfo> menus;
    private List<PermissionInfo> elements;

}

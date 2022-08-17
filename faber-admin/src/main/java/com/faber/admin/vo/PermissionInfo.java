package com.faber.admin.vo;

import lombok.Data;

import java.io.Serializable;

/**
 * 权限点
 *
 * @author wanghaobin
 * @create 2017-06-22 15:19
 */
@Data
public class PermissionInfo implements Serializable {

    private Integer id;
    private String code;
    private String type;
    private String uri;
    private String method;
    private String name;
    private String menu;

}

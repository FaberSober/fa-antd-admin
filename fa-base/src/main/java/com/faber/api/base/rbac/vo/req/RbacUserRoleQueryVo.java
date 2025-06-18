package com.faber.api.base.rbac.vo.req;

import lombok.Data;
import lombok.ToString;

import java.io.Serializable;

@Data
@ToString
public class RbacUserRoleQueryVo implements Serializable {

    private Long roleId;
    private String name;
    private String username;

}

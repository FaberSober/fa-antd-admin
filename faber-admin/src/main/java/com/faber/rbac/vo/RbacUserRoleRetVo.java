package com.faber.rbac.vo;

import com.faber.rbac.entity.RbacUserRole;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class RbacUserRoleRetVo extends RbacUserRole {

    private String name;
    private String username;

}

package com.faber.api.rbac.vo;

import com.faber.api.rbac.entity.RbacUserRole;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class RbacUserRoleRetVo extends RbacUserRole {

    private String name;
    private String username;

}

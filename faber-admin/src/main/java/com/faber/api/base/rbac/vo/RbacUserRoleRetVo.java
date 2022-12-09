package com.faber.api.base.rbac.vo;

import com.faber.api.base.rbac.entity.RbacUserRole;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class RbacUserRoleRetVo extends RbacUserRole {

    private String name;
    private String username;

}
